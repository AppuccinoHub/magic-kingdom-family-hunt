/** Photos are stored as bytes, not Blob/File. iOS Safari rejects Blob values in IndexedDB. */

export type StoredPhoto = { mime: string; bytes: ArrayBuffer };

function viewToBuffer(view: ArrayBufferView): ArrayBuffer {
  const copy = new Uint8Array(view.byteLength);
  copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return copy.buffer;
}

function asBuffer(value: unknown): ArrayBuffer | null {
  if (value instanceof ArrayBuffer) return value.byteLength > 0 ? value : null;
  if (ArrayBuffer.isView(value)) return value.byteLength > 0 ? viewToBuffer(value) : null;
  return null;
}

export function hasStoredPhoto(value: unknown): boolean {
  if (!value) return false;
  if (typeof Blob !== "undefined" && value instanceof Blob) return value.size > 0;
  if (typeof value === "object" && value !== null && "bytes" in value) return Boolean(asBuffer((value as { bytes: unknown }).bytes));
  return Boolean(asBuffer(value));
}

export async function toStoredPhoto(value: unknown): Promise<StoredPhoto | null> {
  if (!value) return null;
  if (typeof Blob !== "undefined" && value instanceof Blob) {
    if (value.size <= 0) return null;
    return { mime: value.type || "image/jpeg", bytes: await value.arrayBuffer() };
  }
  if (typeof value === "object" && value !== null && "bytes" in value) {
    const bytes = asBuffer((value as { bytes: unknown }).bytes);
    if (!bytes) return null;
    const mimeValue = "mime" in value ? (value as { mime?: unknown }).mime : "image/jpeg";
    const mime = typeof mimeValue === "string" && mimeValue ? mimeValue : "image/jpeg";
    return { mime, bytes };
  }
  const bytes = asBuffer(value);
  return bytes ? { mime: "image/jpeg", bytes } : null;
}

export async function photosForStore(photos: Record<string, unknown> | undefined): Promise<Record<string, StoredPhoto>> {
  const next: Record<string, StoredPhoto> = {};
  for (const [key, value] of Object.entries(photos ?? {})) {
    const stored = await toStoredPhoto(value);
    if (stored) next[key] = stored;
  }
  return next;
}

export function storedPhotoToBlob(value: unknown): Blob | null {
  if (!value || typeof Blob === "undefined") return null;
  if (value instanceof Blob) return value.size > 0 ? value : null;
  if (typeof value === "object" && value !== null && "bytes" in value) {
    const bytes = asBuffer((value as { bytes: unknown }).bytes);
    if (!bytes) return null;
    const mimeValue = "mime" in value ? (value as { mime?: unknown }).mime : "image/jpeg";
    const mime = typeof mimeValue === "string" && mimeValue ? mimeValue : "image/jpeg";
    return new Blob([bytes], { type: mime });
  }
  const bytes = asBuffer(value);
  return bytes ? new Blob([bytes], { type: "image/jpeg" }) : null;
}
