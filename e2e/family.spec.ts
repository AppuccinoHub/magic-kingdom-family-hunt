import { writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const photoPath = "/tmp/mk-family-pixel.png";
writeFileSync(
  photoPath,
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  ),
);

async function overflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function startHunt(page: Page, familyName: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start your hunt" }).click();
  await page.locator("#family-name").fill(familyName);
  await page.getByRole("button", { name: "Create our hunt" }).click();
  await page.getByRole("link", { name: "Open the bingo card" }).click();
  await expect(page.getByTestId("stamp-count")).toHaveText("0");
}

async function finishAllButOne(page: Page) {
  await page.evaluate(async () => {
    const active = JSON.parse(localStorage.getItem("mk-active") || "null") as { id: string };
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("mk-family-hunt", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const record = await new Promise<{
      challenges: { done: boolean; stampedByName: string | null; stampedAt: string | null }[];
      members: { nickname: string }[];
      rev: number;
    }>((resolve, reject) => {
      const request = database.transaction("hunts", "readonly").objectStore("hunts").get(active.id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const name = record.members[0]?.nickname ?? "Our family";
    record.challenges.forEach((challenge, index) => {
      if (index > 23) return;
      challenge.done = true;
      challenge.stampedByName = name;
      challenge.stampedAt = new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString();
    });
    record.rev += 1;
    await new Promise<void>((resolve, reject) => {
      const tx = database.transaction("hunts", "readwrite");
      tx.objectStore("hunts").put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  });
  await page.reload();
  await expect(page.getByTestId("stamp-count")).toHaveText("24");
}

test("one phone keeps the hunt, photos, and a single celebration", async ({ page, browser }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Our family adventure" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Smaller text" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start your hunt" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/welcome-day-mobile.png" });
  await page.getByRole("button", { name: "How to play" }).click();
  await expect(page.getByRole("heading", { name: "How to play" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/screen-how-to-play.png" });
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByTestId("device-notice")).toContainText("stay in this browser on this device");
  await expect(page.getByTestId("device-notice")).toContainText("Another phone does not share");
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("button", { name: "Night fireworks" }).click();
  const night = page.locator("img[src*='banner-night']");
  await expect(night).toBeVisible();
  await night.evaluate(
    (img) =>
      img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise((resolve) => img.addEventListener("load", () => resolve(undefined), { once: true })),
  );
  await page.screenshot({ path: "/opt/cursor/artifacts/welcome-night-mobile.png" });
  await page.getByRole("button", { name: "Day scene" }).click();
  await expect(page.getByText("👑")).toHaveCount(0);
  await expect(page.getByText("⭐")).toHaveCount(0);
  await page.screenshot({ path: "/opt/cursor/artifacts/welcome-mobile.png" });
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await overflow(page), `welcome ${width}`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });

  await startHunt(page, "The Patel family");
  await expect(page.getByTestId("stamp-count")).toHaveText("0");
  await page.screenshot({ path: "/opt/cursor/artifacts/screen-progress.png" });
  await page.getByRole("button", { name: "Bingo card" }).click();
  await expect(page.getByRole("heading", { name: "Bingo card" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/board-mobile.png" });
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await overflow(page), `board ${width}`).toBeLessThanOrEqual(1);
  }
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole("button", { name: /Square 1\./ }).click();
  await expect(page.getByTestId("card-words")).toHaveText("Take a pic with the castle");
  await page.screenshot({ path: "/opt/cursor/artifacts/screen-challenge-1.png" });
  await page.screenshot({ path: "/opt/cursor/artifacts/stamp-unearned-mobile.png" });
  await page.getByRole("button", { name: "Next" }).first().click();
  await expect(page.getByTestId("card-words")).toHaveText("See if Walt's light is on above the fire station");
  await page.screenshot({ path: "/opt/cursor/artifacts/screen-challenge-2.png" });
  await page.getByRole("button", { name: "Back" }).first().click();
  await expect(page.getByTestId("card-words")).toHaveText("Take a pic with the castle");
  await page.getByRole("button", { name: "Passport" }).click();
  await expect(page.getByRole("heading", { name: "Adventure passport" })).toBeVisible();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("button", { name: "Open a challenge" }).click();
  await expect(page.getByTestId("card-words")).toHaveText("Take a pic with the castle");
  expect(await overflow(page)).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "We did it. Add our stamp" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await expect(page.getByRole("img", { name: "Passport stamp, Castle" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/stamp-earned-mobile.png" });
  await page.getByLabel("Note for this challenge").fill("By the roses");
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page.getByText("Note saved in this browser.")).toBeVisible();
  await page.getByTestId("photo-input").setInputFiles(photoPath);
  await expect(page.getByText("It is not in your camera roll.")).toBeVisible();
  await expect(page.getByRole("img", { name: "Photo for challenge 1" })).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("stamp-count")).toHaveText("1");
  await page.getByRole("button", { name: "Bingo card" }).click();
  await page.getByRole("button", { name: /Square 1\./ }).click();
  await expect(page.getByLabel("Note for this challenge")).toHaveValue("By the roses");
  await expect(page.getByRole("img", { name: "Photo for challenge 1" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/photo-kept-mobile.png" });

  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto("/");
  await expect(otherPage.getByRole("button", { name: "Open The Patel family" })).toHaveCount(0);
  await otherPage.getByRole("button", { name: "Where this is saved" }).click();
  await expect(otherPage.getByTestId("device-notice")).toBeVisible();
  await other.close();

  await finishAllButOne(page);
  await page.getByRole("button", { name: "Open a challenge" }).click();
  await page.getByRole("button", { name: "We did it. Add our stamp" }).click();
  await expect(page.getByTestId("found-everything")).toBeVisible();
  await expect(page.getByRole("heading", { name: "You found everything!" })).toBeVisible();
  await page.getByRole("heading", { name: "You found everything!" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/opt/cursor/artifacts/found-everything-mobile.png" });
  await page.getByRole("button", { name: "Back to memories" }).click();
  await expect(page.getByTestId("found-everything")).toBeHidden();
  await page.reload();
  await expect(page.getByTestId("found-everything")).toHaveCount(0);
  await page.getByRole("button", { name: "Passport" }).click();
  await expect(page.getByRole("img", { name: "Passport stamp, Castle" })).toBeVisible();
  await page.screenshot({ path: "/opt/cursor/artifacts/passport-mobile.png" });
  await page.screenshot({ path: "/opt/cursor/artifacts/passport-stamps-mobile.png" });
  const stamps = page.getByRole("img", { name: /^Passport stamp,/ });
  await expect(stamps).toHaveCount(25);
  await stamps.nth(2).scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/opt/cursor/artifacts/passport-stamps-variety-mobile.png" });
  await page.getByTestId("replay-celebration").click();
  await expect(page.getByRole("heading", { name: "You found everything!" })).toBeVisible();
});

test("reduced motion keeps the full-card party still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await startHunt(page, "The Rivera family");
  await finishAllButOne(page);
  await page.getByRole("button", { name: "Open a challenge" }).click();
  await page.getByRole("button", { name: "We did it. Add our stamp" }).click();
  await expect(page.getByTestId("found-everything")).toBeVisible();
  await expect(page.getByTestId("confetti")).toHaveCount(0);
  await expect(page.getByTestId("static-stars")).toBeVisible();
  await expect(page.locator(".firework-once")).toHaveCount(0);
  await page.screenshot({ path: "/opt/cursor/artifacts/found-everything-still.png" });
});
