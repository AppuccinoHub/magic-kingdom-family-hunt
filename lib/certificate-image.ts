import { jpegSize } from "@/lib/certificate-pdf";

const MAX_EDGE = 1200;

/** A smaller JPEG for the PDF only. The saved photo is left as it is. */
export async function jpegForCertificate(blob: Blob): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  if (!blob || blob.size <= 0) return null;
  if (blob.type === "image/jpeg") {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const size = jpegSize(bytes);
    if (size && size.width > 0 && size.height > 0 && size.width <= MAX_EDGE && size.height <= MAX_EDGE) {
      return { bytes, width: size.width, height: size.height };
    }
  }

  const bitmap = await loadBitmap(blob);
  if (!bitmap) return null;
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return null;
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const output = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.72));
  canvas.width = 0;
  canvas.height = 0;
  if (!output) return null;
  return { bytes: new Uint8Array(await output.arrayBuffer()), width, height };
}

async function loadBitmap(blob: Blob): Promise<ImageBitmap | null> {
  try {
    return await createImageBitmap(blob);
  } catch {
    const url = URL.createObjectURL(blob);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("photo"));
        element.src = url;
      });
      return await createImageBitmap(image);
    } catch {
      return null;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}
