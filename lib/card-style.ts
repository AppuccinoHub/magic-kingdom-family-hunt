const TINTS = ["bg-peach", "bg-butter", "bg-mint", "bg-sky", "bg-lilac"] as const;

export function cardTint(index: number): string {
  return TINTS[index % TINTS.length];
}

const STAMP_FILLS: Record<string, string> = {
  lamp: "#FFE7AE",
  vehicle: "#FFD0E0",
  paw: "#FFE0D2",
  baseball: "#D5F3E4",
  flag: "#D5F0FF",
  peanut: "#FFE7AE",
  sniff: "#FFD6C9",
  antlers: "#F0E0FF",
  elephant: "#D5F0FF",
  lizard: "#D5F3E4",
  bat: "#E4D8F8",
  search: "#FFE7AE",
  river: "#D5F0FF",
  question: "#FFD0E0",
  spark: "#F0E0FF",
  fountain: "#D5F0FF",
  bag: "#FFE7AE",
  letter: "#FFD6C9",
  door: "#F0E0FF",
  camel: "#FFE7AE",
  tiles: "#D5F3E4",
  cart: "#FFE7AE",
  cup: "#FFD6C9",
  badge: "#D5F0FF",
  castle: "#FFE0D2",
};

export function stampFill(name: string): string {
  return STAMP_FILLS[name] ?? "#FFE0D2";
}
