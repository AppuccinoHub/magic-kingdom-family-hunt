export const COOKIE_NAME = "mkhunt";

export function cookieOptions(req: Request) {
  const forwarded = req.headers.get("x-forwarded-proto");
  const secure = forwarded
    ? forwarded.split(",")[0].trim() === "https"
    : new URL(req.url).protocol === "https:";
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  };
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim() ?? "";
    if (ip) return ip.slice(0, 80);
  }
  return "local";
}
