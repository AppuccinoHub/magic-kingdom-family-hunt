export const AVATARS = [
  { id: "crown", emoji: "👑", label: "Crown" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "sun", emoji: "☀️", label: "Sun" },
  { id: "heart", emoji: "💛", label: "Heart" },
  { id: "leaf", emoji: "🌿", label: "Leaf" },
  { id: "boat", emoji: "⛵", label: "Boat" },
  { id: "compass", emoji: "🧭", label: "Compass" },
  { id: "camera", emoji: "📷", label: "Camera" },
  { id: "balloon", emoji: "🎈", label: "Balloon" },
  { id: "moon", emoji: "🌙", label: "Moon" },
  { id: "flower", emoji: "🌸", label: "Flower" },
  { id: "apple", emoji: "🍎", label: "Apple" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function avatarById(id: string) {
  return AVATARS.find((avatar) => avatar.id === id) ?? null;
}
