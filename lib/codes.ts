/** Unambiguous alphabet. 32 symbols, so a random byte maps evenly. 12 chars is 60 bits. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += CODE_ALPHABET[byte % 32];
  return out;
}

export function formatCode(raw: string): string {
  const code = normalizeCode(raw);
  if (code.length !== 12) return raw.trim();
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
}

export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidCode(input: string): boolean {
  const code = normalizeCode(input);
  return code.length === 12 && [...code].every((char) => CODE_ALPHABET.includes(char));
}
