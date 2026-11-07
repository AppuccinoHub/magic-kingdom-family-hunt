const TINTS = ["bg-peach", "bg-butter", "bg-mint", "bg-sky", "bg-lilac"] as const;

export function cardTint(index: number): string {
  return TINTS[index % TINTS.length];
}

const STAMP_FILLS: Record<string, string> = {
  lamp: "#3A2412",
  vehicle: "#2A1848",
  paw: "#3A221C",
  baseball: "#14352C",
  flag: "#1A2744",
  peanut: "#3A2A12",
  sniff: "#3A1E24",
  antlers: "#2A1844",
  elephant: "#1C3044",
  lizard: "#14352C",
  bat: "#241838",
  search: "#3A2A12",
  river: "#1A3040",
  question: "#3A1C30",
  spark: "#2A1848",
  fountain: "#163044",
  bag: "#3A2412",
  letter: "#3A1E24",
  door: "#2C2040",
  camel: "#3A2A12",
  tiles: "#1A3330",
  cart: "#3A2418",
  cup: "#3A1E24",
  badge: "#1A2748",
  castle: "#2A1848",
};

export function stampFill(name: string): string {
  return STAMP_FILLS[name] ?? "#2A1848";
}
