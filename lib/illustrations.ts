/** Replaceable raster art. Files live in public/art. */
export const ART = {
  bannerNight: "banner-night.jpg",
  bannerDay: "banner-day.jpg",
  carousel: "thumb-carousel.jpg",
  train: "thumb-train.jpg",
  rocket: "thumb-rocket.jpg",
  fireworks: "thumb-fireworks.jpg",
} as const;

export function artSrc(file: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/art/${file}`;
}

const TRAIN = new Set(["cart", "vehicle", "camel", "river"]);
const ROCKET = new Set(["badge", "spark", "lamp"]);
const CAROUSEL = new Set(["elephant", "flag", "baseball", "paw", "peanut"]);

export function challengeImage(icon: string): string {
  if (TRAIN.has(icon)) return artSrc(ART.train);
  if (ROCKET.has(icon)) return artSrc(ART.rocket);
  if (CAROUSEL.has(icon)) return artSrc(ART.carousel);
  return artSrc(ART.fireworks);
}
