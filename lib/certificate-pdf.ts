/** A souvenir PDF built in the browser. It does not read or change saved hunts. */

export type CertificatePdfPhoto = {
  bytes: Uint8Array;
  width: number;
  height: number;
};

export type CertificatePdfEntry = {
  index: number;
  text: string;
  note: string;
  stampedBy: string;
  when: string;
  photo: CertificatePdfPhoto | null;
};

export type CertificatePdfInput = {
  familyName: string;
  advisorLine: string;
  stampCount: number;
  bingoLineCount: number;
  full: boolean;
  printedAt: string;
  entries: CertificatePdfEntry[];
};

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;
const BOTTOM = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

type Op =
  | { t: "text"; text: string; size: number; bold: boolean; x: number; y: number }
  | { t: "image"; image: number; x: number; y: number; w: number; h: number };

type Page = { ops: Op[] };

export function jpegSize(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let i = 2;
  while (i + 8 < bytes.length) {
    if (bytes[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = bytes[i + 1];
    if (marker === 0xd9) break;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    if (length < 2) break;
    if (marker >= 0xc0 && marker <= 0xc2 && i + 8 < bytes.length) {
      return {
        height: (bytes[i + 5] << 8) | bytes[i + 6],
        width: (bytes[i + 7] << 8) | bytes[i + 8],
      };
    }
    i += 2 + length;
  }
  return null;
}

export function certificateFilename(familyName: string): string {
  const clean = familyName
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${clean || "family"}-memory.pdf`;
}

export function buildCertificatePdf(input: CertificatePdfInput): Uint8Array {
  const images: CertificatePdfPhoto[] = [];
  const pages: Page[] = [];
  let page: Page = { ops: [] };
  let cursor = PAGE_H - MARGIN;
  pages.push(page);

  function newPage() {
    page = { ops: [] };
    pages.push(page);
    cursor = PAGE_H - MARGIN;
  }

  function ensure(height: number) {
    if (cursor - height < BOTTOM) newPage();
  }

  function wrap(text: string, size: number): string[] {
    const max = Math.max(8, Math.floor(CONTENT_W / (size * 0.56)));
    const lines: string[] = [];
    for (const paragraph of text.split(/\n/)) {
      const words = paragraph.split(/\s+/).filter((word) => word.length > 0);
      if (words.length === 0) {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of words) {
        if (word.length > max) {
          if (line) lines.push(line);
          for (let index = 0; index < word.length; index += max) lines.push(word.slice(index, index + max));
          line = "";
          continue;
        }
        const next = line ? `${line} ${word}` : word;
        if (next.length > max) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      if (line) lines.push(line);
    }
    return lines.length ? lines : [""];
  }

  function lineHeight(size: number) {
    return size + 4;
  }

  function drawLine(text: string, size: number, bold: boolean) {
    ensure(lineHeight(size));
    cursor -= size;
    page.ops.push({ t: "text", text, size, bold, x: MARGIN, y: cursor });
    cursor -= 4;
  }

  function drawText(text: string, size: number, bold: boolean) {
    for (const line of wrap(text, size)) drawLine(line, size, bold);
  }

  function photoBox(photo: CertificatePdfPhoto) {
    const scale = Math.min(CONTENT_W / photo.width, 340 / photo.height);
    return { w: photo.width * scale, h: photo.height * scale };
  }

  function blockHeight(lines: { size: number }[], photo: CertificatePdfPhoto | null) {
    const text = lines.reduce((sum, line) => sum + lineHeight(line.size), 0);
    return text + (photo ? photoBox(photo).h + 8 : 0) + 14;
  }

  drawText("Adventure passport", 14, false);
  drawText(input.full ? "Full card complete" : "Family memory certificate", 20, true);
  drawText(input.familyName, 16, true);
  drawText(input.advisorLine, 12, true);
  drawText(`${input.stampCount} of 25 stamps. ${input.bingoLineCount} of 12 bingo lines.`, 12, false);
  drawText(`Printed ${input.printedAt}. This souvenir is for your family.`, 11, false);
  ensure(8);
  cursor -= 8;

  if (input.entries.length === 0) {
    drawText("You do not have stamps yet. Go play, then come back.", 14, true);
  }

  for (const entry of input.entries) {
    const stamp = `${entry.index + 1}. ${entry.stampedBy ? `Stamped by ${entry.stampedBy}` : "Stamped"}${entry.when ? ` · ${entry.when}` : ""}`;
    const lines = [
      ...wrap(stamp, 11).map((text) => ({ text, size: 11, bold: true })),
      ...wrap(entry.text, 13).map((text) => ({ text, size: 13, bold: true })),
      ...(entry.note ? wrap(`Note: ${entry.note}`, 12).map((text) => ({ text, size: 12, bold: false })) : []),
    ];
    const needed = blockHeight(lines, entry.photo);
    const pageHasPhoto = page.ops.some((op) => op.t === "image");
    if (entry.photo && (pageHasPhoto || cursor - needed < BOTTOM)) newPage();
    else if (!entry.photo && cursor - needed < BOTTOM) newPage();
    for (const line of lines) drawLine(line.text, line.size, line.bold);
    if (entry.photo) {
      const box = photoBox(entry.photo);
      if (cursor - box.h < BOTTOM) newPage();
      cursor -= box.h;
      const image = images.length;
      images.push(entry.photo);
      page.ops.push({ t: "image", image, x: MARGIN, y: cursor, w: box.w, h: box.h });
      cursor -= 8;
    }
    ensure(12);
    cursor -= 12;
  }

  drawText("Times and treats printed on the card can change. Check at the park on the day you go. This app has no timer.", 10, false);
  drawText("Park times printed on the original card should be checked at the park. This certificate does not set a schedule.", 10, false);
  drawText("An independent fan activity for families. Not an official Disney app. Not affiliated with The Walt Disney Company or Walt Disney World.", 10, false);

  return encodePdf(pages, images);
}

function pdfLiteral(text: string): string {
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0) ?? 63;
    const mapped =
      code === 0x2018 || code === 0x2019
        ? 0x27
        : code === 0x201c || code === 0x201d
          ? 0x22
          : code === 0x2013 || code === 0x2014
            ? 0x2d
            : code === 0x00a0
              ? 0x20
              : code === 0x00b7
                ? 0xb7
                : code > 255
                  ? 0x3f
                  : code < 32
                    ? 0x20
                    : code;
    if (mapped === 0x5c) out += "\\\\";
    else if (mapped === 0x28) out += "\\(";
    else if (mapped === 0x29) out += "\\)";
    else out += String.fromCharCode(mapped);
  }
  return `(${out})`;
}

function encodePdf(pages: Page[], images: CertificatePdfPhoto[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  let length = 0;
  const offsets: number[] = [];

  function push(bytes: Uint8Array) {
    chunks.push(bytes);
    length += bytes.length;
  }

  function text(value: string) {
    const bytes = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index += 1) bytes[index] = value.charCodeAt(index) & 0xff;
    push(bytes);
  }

  function startObj(id: number) {
    offsets[id] = length;
    text(`${id} 0 obj\n`);
  }

  function endObj() {
    text("\nendobj\n");
  }

  let next = 5;
  const imageIds = images.map(() => next++);
  const pageIds = pages.map(() => ({ content: next++, page: next++ }));
  const size = next;

  text("%PDF-1.4\n");
  push(Uint8Array.from([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  startObj(1);
  text("<< /Type /Catalog /Pages 2 0 R >>");
  endObj();

  startObj(2);
  text(`<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map((item) => `${item.page} 0 R`).join(" ")}] >>`);
  endObj();

  startObj(3);
  text("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  endObj();

  startObj(4);
  text("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  endObj();

  images.forEach((image, index) => {
    startObj(imageIds[index]);
    text(
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`,
    );
    push(image.bytes);
    text("\nendstream");
    endObj();
  });

  pages.forEach((item, index) => {
    const body = item.ops
      .map((op) => {
        if (op.t === "text") {
          return `BT\n/${op.bold ? "F2" : "F1"} ${op.size} Tf\n${op.x.toFixed(2)} ${op.y.toFixed(2)} Td\n${pdfLiteral(op.text)} Tj\nET`;
        }
        return `q\n${op.w.toFixed(2)} 0 0 ${op.h.toFixed(2)} ${op.x.toFixed(2)} ${op.y.toFixed(2)} cm\n/Im${op.image} Do\nQ`;
      })
      .join("\n");
    const used = [...new Set(item.ops.flatMap((op) => (op.t === "image" ? [`/Im${op.image} ${imageIds[op.image]} 0 R`] : [])))];
    const xobject = used.length ? ` /XObject << ${used.join(" ")} >>` : "";
    startObj(pageIds[index].content);
    text(`<< /Length ${body.length} >>\nstream\n`);
    text(body);
    text("\nendstream");
    endObj();

    startObj(pageIds[index].page);
    text(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${pageIds[index].content} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >>${xobject} >> >>`,
    );
    endObj();
  });

  const xref = length;
  text(`xref\n0 ${size}\n`);
  text("0000000000 65535 f \n");
  for (let id = 1; id < size; id += 1) text(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  text(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}
