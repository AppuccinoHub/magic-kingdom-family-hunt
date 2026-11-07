export async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This photo did not open.");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob) throw new Error("This photo did not open.");
    if (blob.size > 2_200_000) {
      const smaller = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.6));
      if (!smaller || smaller.size > 2_200_000) {
        throw new Error("That photo is too big. Try a smaller one.");
      }
      return smaller;
    }
    return blob;
  } catch (error) {
    if (file.size <= 2_200_000 && /image\/(jpeg|png|webp)/.test(file.type)) return file;
    if (error instanceof Error && error.message.startsWith("That photo")) throw error;
    throw new Error("This photo type did not open. Try a JPEG or PNG.");
  }
}
