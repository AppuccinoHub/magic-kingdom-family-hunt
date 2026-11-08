import assert from "node:assert/strict";
import test from "node:test";
import { CHALLENGES } from "../lib/challenges";
import { buildCertificatePdf, certificateFilename, jpegSize, type CertificatePdfEntry, type CertificatePdfPhoto } from "../lib/certificate-pdf";

const TINY_JPEG = Uint8Array.from(
  Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEBAPDw8PDw8PDw8PDw8PDw8PFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAQABAAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAADAAIEBQYBB//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAaAQADAQEBAQAAAAAAAAAAAAABAgMABAUG/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AnQAAAAD/2Q==",
    "base64",
  ),
);

function pdfString(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return text;
}

function visibleText(bytes: Uint8Array): string {
  const pdf = pdfString(bytes);
  const parts: string[] = [];
  for (const match of pdf.matchAll(/\((?:\\.|[^\\)])*\) Tj/g)) {
    const raw = match[0];
    const inner = raw.slice(1, raw.lastIndexOf(")"));
    parts.push(inner.replace(/\\([\\()])/g, "$1"));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function contentStreams(bytes: Uint8Array): string[] {
  const pdf = pdfString(bytes);
  const streams: string[] = [];
  for (const match of pdf.matchAll(/stream\n([\s\S]*?)\nendstream/g)) {
    if (match[1].includes(" Tj") || match[1].includes(" Do")) streams.push(match[1]);
  }
  return streams;
}

function pageCount(bytes: Uint8Array): number {
  return pdfString(bytes).match(/\/Type \/Page(?!s)/g)?.length ?? 0;
}

function imagePlacements(stream: string) {
  return [...stream.matchAll(/q\n([0-9.]+) 0 0 ([0-9.]+) ([0-9.]+) ([0-9.]+) cm\n\/Im(\d+) Do/g)].map((match) => ({
    w: Number(match[1]),
    h: Number(match[2]),
    x: Number(match[3]),
    y: Number(match[4]),
  }));
}

function entry(index: number, photo: CertificatePdfPhoto | null, note = `Rose note ${index + 1}`): CertificatePdfEntry {
  return {
    index,
    text: CHALLENGES[index].text,
    note,
    stampedBy: "Our family",
    when: "Jan 2, 2026, 3:04 PM",
    photo,
  };
}

function photo(): CertificatePdfPhoto {
  const size = jpegSize(TINY_JPEG);
  assert.ok(size);
  return { bytes: TINY_JPEG, width: size.width, height: size.height };
}

function build(entries: CertificatePdfEntry[], stampCount = entries.length) {
  return buildCertificatePdf({
    familyName: "The Patel family",
    advisorLine: "Shared by Aunt Sue.",
    stampCount,
    bingoLineCount: stampCount === 25 ? 12 : 0,
    full: stampCount === 25,
    printedAt: "Nov 8, 2026, 3:00 AM",
    entries,
  });
}

test("jpeg size reads a real photo and a large camera frame", () => {
  const tiny = jpegSize(TINY_JPEG);
  assert.ok(tiny);
  assert.ok(tiny.width >= 1 && tiny.height >= 1);
  const frame = jpegSize(Uint8Array.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x0b, 0xd0, 0x0f, 0xc0, 0x01, 0x01, 0x11, 0x00, 0xff, 0xd9]));
  assert.deepEqual(frame, { width: 4032, height: 3024 });
});

test("a certificate with no stamps is one page and does not invent photos", () => {
  const bytes = build([]);
  const text = visibleText(bytes);
  assert.match(text, /You do not have stamps yet/);
  assert.match(text, /The Patel family/);
  assert.equal(pageCount(bytes), 1);
  assert.equal(pdfString(bytes).includes(" Do"), false);
  assert.equal(certificateFilename("The Patel family"), "The-Patel-family-memory.pdf");
});

test("one, two, and three photos stay with their notes and are not cut across pages", () => {
  for (const count of [1, 2, 3]) {
    const bytes = build(Array.from({ length: count }, (_, index) => entry(index, photo())));
    const text = visibleText(bytes);
    const streams = contentStreams(bytes);
    assert.equal(streams.flatMap((stream) => imagePlacements(stream)).length, count, `${count} photos`);
    for (let index = 0; index < count; index += 1) {
      assert.ok(text.includes(CHALLENGES[index].text), CHALLENGES[index].text);
      assert.ok(text.includes(`Rose note ${index + 1}`));
      const home = streams.find((stream) => stream.includes(`Rose note ${index + 1}`));
      assert.ok(home, `note ${index + 1} page`);
      const placed = imagePlacements(home);
      assert.equal(placed.length, 1, `one photo on the note page for ${count}`);
      assert.ok(placed[0].y >= 48);
      assert.ok(placed[0].y + placed[0].h <= 744.1);
    }
    assert.ok(pageCount(bytes) >= count);
  }
});

test("a full hunt keeps all 25 card lines, notes, and photos on uncut pages", () => {
  const bytes = build(CHALLENGES.map((_, index) => entry(index, photo(), `Memory ${index + 1}`)));
  const text = visibleText(bytes);
  const streams = contentStreams(bytes);
  assert.match(text, /Full card complete/);
  assert.match(text, /25 of 25 stamps/);
  assert.match(text, /12 of 12 bingo lines/);
  for (const challenge of CHALLENGES) assert.ok(text.includes(challenge.text), challenge.text);
  for (let index = 0; index < 25; index += 1) {
    const home = streams.find((stream) => stream.includes(`Memory ${index + 1}`));
    assert.ok(home);
    const placed = imagePlacements(home);
    assert.equal(placed.length, 1);
    assert.ok(placed[0].y >= 48);
    assert.ok(placed[0].y + placed[0].h <= 744.1);
  }
  assert.equal(streams.reduce((sum, stream) => sum + imagePlacements(stream).length, 0), 25);
  assert.ok(pageCount(bytes) >= 25);
  assert.doesNotMatch(text, /Print or save as PDF/);
});

test("stamps without photos keep the card words and do not add images", () => {
  const bytes = build([entry(0, null, "By the roses"), entry(19, null, "Knock (gently)")]);
  const text = visibleText(bytes);
  assert.match(text, /Take a pic with the castle/);
  assert.match(text, /Knock on the painting at Momento Mori/);
  assert.match(text, /By the roses/);
  assert.match(text, /Knock \(gently\)|Knock \(gently\)/);
  assert.ok(text.includes("Knock (gently)"));
  assert.equal(contentStreams(bytes).some((stream) => stream.includes(" Do")), false);
});

test("a card line with parentheses stays exact", () => {
  const bytes = build([entry(4, null, "Saw the pitch")]);
  assert.ok(visibleText(bytes).includes("Watch the first pitch get thrown at Casey's (10:30)"));
});
