import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { expect, test, type Page } from "@playwright/test";
import { CHALLENGES } from "../lib/challenges";

const pixel =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const hiresPath = "/tmp/mk-certificate-hires.jpg";

spawnSync("ffmpeg", ["-y", "-f", "lavfi", "-i", "color=c=0x2266aa:s=4032x3024", "-frames:v", "1", "-update", "1", hiresPath], {
  stdio: "ignore",
});

function pdfString(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return text;
}

function visibleText(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (const match of pdfString(bytes).matchAll(/\((?:\\.|[^\\)])*\) Tj/g)) {
    const raw = match[0];
    parts.push(raw.slice(1, raw.lastIndexOf(")")).replace(/\\([\\()])/g, "$1"));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function placements(bytes: Uint8Array) {
  const streams = [...pdfString(bytes).matchAll(/stream\n([\s\S]*?)\nendstream/g)]
    .map((match) => match[1])
    .filter((stream) => stream.includes(" Tj") || stream.includes(" Do"));
  return streams.flatMap((stream) =>
    [...stream.matchAll(/q\n([0-9.]+) 0 0 ([0-9.]+) ([0-9.]+) ([0-9.]+) cm\n\/Im\d+ Do/g)].map((match) => ({
      stream,
      w: Number(match[1]),
      h: Number(match[2]),
      y: Number(match[4]),
    })),
  );
}

function pixelWidths(bytes: Uint8Array): number[] {
  return [...pdfString(bytes).matchAll(/\/Width (\d+) \/Height (\d+)/g)].map((match) => Number(match[1]));
}

async function seed(
  page: Page,
  {
    photos,
    stamps,
    b64 = pixel,
    mime = "image/png",
    asBlob = false,
  }: { photos: number; stamps: number; b64?: string; mime?: string; asBlob?: boolean },
) {
  await page.goto("/");
  await page.evaluate(
    async ({ photos, stamps, b64, mime, asBlob }) => {
      const binary = atob(b64);
      const raw = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) raw[index] = binary.charCodeAt(index);
      const id = crypto.randomUUID();
      const memberId = crypto.randomUUID();
      const record = {
        id,
        rev: 1,
        familyName: "The Patel family",
        advisorName: "Aunt Sue",
        createdAt: "2026-01-01T00:00:00.000Z",
        meId: memberId,
        members: [{ id: memberId, nickname: "Our family", avatar: "star" }],
        challenges: Array.from({ length: 25 }, (_, index) => ({
          index,
          done: index < stamps,
          note: index < stamps ? `Rose note ${index + 1}` : "",
          stampedByName: index < stamps ? "Our family" : null,
          stampedAt: index < stamps ? "2026-01-02T15:04:00.000Z" : null,
        })),
        photos: Object.fromEntries(
          Array.from({ length: photos }, (_, index) => {
            const copy = raw.slice();
            return [String(index), asBlob ? new Blob([copy], { type: mime }) : { mime, bytes: copy.buffer }];
          }),
        ),
      };
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("mk-family-hunt", 1);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains("hunts")) request.result.createObjectStore("hunts", { keyPath: "id" });
        };
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const tx = request.result.transaction("hunts", "readwrite");
          tx.objectStore("hunts").put(record);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        };
      });
      localStorage.setItem("mk-active", JSON.stringify({ mode: "phone", id }));
    },
    { photos, stamps, b64, mime, asBlob },
  );
}

async function savedSnapshot(page: Page) {
  return page.evaluate(async () => {
    const active = JSON.parse(localStorage.getItem("mk-active") || "null") as { id: string };
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("mk-family-hunt", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const record = await new Promise<{
      rev: number;
      challenges: { done: boolean; note: string }[];
      photos?: Record<string, { bytes?: ArrayBuffer } | Blob>;
    }>((resolve, reject) => {
      const request = database.transaction("hunts", "readonly").objectStore("hunts").get(active.id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const photos = record.photos ?? {};
    return {
      rev: record.rev,
      done: record.challenges.filter((challenge) => challenge.done).length,
      note: record.challenges[0]?.note ?? "",
      photoKeys: Object.keys(photos).length,
      firstLength: photos["0"] instanceof Blob ? photos["0"].size : (photos["0"]?.bytes?.byteLength ?? 0),
    };
  });
}

async function downloadPdf(page: Page, artifact: string) {
  await page.goto("/certificate/");
  const button = page.getByTestId("save-pdf");
  await expect(button).toBeEnabled();
  await expect(button).toHaveText("Print or save as PDF");
  const before = await savedSnapshot(page);
  const [download] = await Promise.all([page.waitForEvent("download"), button.click()]);
  const path = await download.path();
  expect(path).toBeTruthy();
  const bytes = new Uint8Array(readFileSync(path!));
  copyFileSync(path!, artifact);
  await expect(page.getByText("still in this browser")).toBeVisible();
  const after = await savedSnapshot(page);
  expect(after).toEqual(before);
  return bytes;
}

test("zero, one, two, and three photos export without dropping notes", async ({ page }) => {
  for (const count of [0, 1, 2, 3]) {
    await seed(page, { photos: count, stamps: Math.max(count, 3) });
    const bytes = await downloadPdf(page, `/opt/cursor/artifacts/family-memory-${count}-photos.pdf`);
    const text = visibleText(bytes);
    const placed = placements(bytes);
    expect(placed).toHaveLength(count);
    for (const photo of placed) {
      expect(photo.y).toBeGreaterThanOrEqual(48);
      expect(photo.y + photo.h).toBeLessThanOrEqual(744.1);
    }
    for (let index = 0; index < Math.max(count, 3); index += 1) {
      expect(text).toContain(CHALLENGES[index].text);
      expect(text).toContain(`Rose note ${index + 1}`);
    }
    expect(text).not.toContain("Print or save as PDF");
    if (count === 2) await page.screenshot({ path: "/opt/cursor/artifacts/certificate-two-photos-mobile.png" });
  }
});

test("two older blob photos still export and stay stored", async ({ page }) => {
  await seed(page, { photos: 2, stamps: 2, asBlob: true });
  const bytes = await downloadPdf(page, "/opt/cursor/artifacts/family-memory-2-legacy-blobs.pdf");
  expect(placements(bytes)).toHaveLength(2);
  expect(visibleText(bytes)).toContain("Rose note 2");
  const kept = await savedSnapshot(page);
  expect(kept.photoKeys).toBe(2);
  expect(kept.firstLength).toBeGreaterThan(0);
  expect(kept.rev).toBe(1);
});

test("a full 25-photo hunt keeps every card line, note, and photo", async ({ page }) => {
  await seed(page, { photos: 25, stamps: 25 });
  const bytes = await downloadPdf(page, "/opt/cursor/artifacts/family-memory-25-photos.pdf");
  const text = visibleText(bytes);
  const placed = placements(bytes);
  expect(placed).toHaveLength(25);
  expect(pdfString(bytes).match(/\/Type \/Page(?!s)/g)?.length ?? 0).toBeGreaterThanOrEqual(25);
  for (const challenge of CHALLENGES) expect(text).toContain(challenge.text);
  for (let index = 0; index < 25; index += 1) expect(text).toContain(`Rose note ${index + 1}`);
  for (const photo of placed) {
    expect(photo.y).toBeGreaterThanOrEqual(48);
    expect(photo.y + photo.h).toBeLessThanOrEqual(744.1);
  }
  const kept = await savedSnapshot(page);
  expect(kept.done).toBe(25);
  expect(kept.photoKeys).toBe(25);
  expect(kept.rev).toBe(1);
});

test("a 4032 pixel photo is scaled into the PDF and the original stays saved", async ({ page }) => {
  const hires = readFileSync(hiresPath).toString("base64");
  await seed(page, { photos: 1, stamps: 1, b64: hires, mime: "image/jpeg" });
  const bytes = await downloadPdf(page, "/opt/cursor/artifacts/family-memory-hires.pdf");
  const widths = pixelWidths(bytes);
  expect(widths.length).toBeGreaterThan(0);
  for (const width of widths) expect(width).toBeLessThanOrEqual(1200);
  expect(visibleText(bytes)).toContain("Take a pic with the castle");
  expect(visibleText(bytes)).toContain("Rose note 1");
  const kept = await savedSnapshot(page);
  expect(kept.firstLength).toBe(readFileSync(hiresPath).length);
  expect(kept.note).toBe("Rose note 1");
});

test("adding a high-res photo from the challenge still makes a PDF", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start your hunt" }).click();
  await page.locator("#family-name").fill("The Patel family");
  await page.getByRole("button", { name: "Create our hunt" }).click();
  await page.getByRole("link", { name: "Open the bingo card" }).click();
  await page.getByRole("button", { name: "Open a challenge" }).click();
  await page.getByRole("button", { name: "We did it. Add our stamp" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByLabel("Note for this challenge").fill("By the roses");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByText("Note saved in this browser.")).toBeVisible();
  await page.getByTestId("photo-input").setInputFiles(hiresPath);
  await expect(page.getByText("It is not in your camera roll.")).toBeVisible();
  const before = await savedSnapshot(page);
  expect(before.firstLength).toBeGreaterThan(0);
  expect(before.note).toBe("By the roses");
  await page.getByRole("button", { name: "Passport" }).click();
  await page.getByRole("link", { name: "Make a souvenir certificate" }).click();
  await expect(page.getByRole("heading", { name: "Family memory certificate" })).toBeVisible();
  const bytes = await downloadPdf(page, "/opt/cursor/artifacts/family-memory-from-challenge.pdf");
  const text = visibleText(bytes);
  expect(text).toContain("Take a pic with the castle");
  expect(text).toContain("By the roses");
  expect(placements(bytes)).toHaveLength(1);
  for (const width of pixelWidths(bytes)) expect(width).toBeLessThanOrEqual(1200);
  const after = await savedSnapshot(page);
  expect(after.firstLength).toBe(before.firstLength);
  expect(after.note).toBe("By the roses");
  expect(after.done).toBe(1);
});
