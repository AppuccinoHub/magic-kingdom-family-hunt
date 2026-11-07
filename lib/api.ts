import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME, cookieOptions } from "@/lib/cookies";
import { HuntError } from "@/lib/store";

export function jsonError(error: unknown): NextResponse {
  if (error instanceof HuntError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json(
    { error: "Something went wrong on the hunt server. Your other stamps are still saved. Try again." },
    { status: 500 },
  );
}

export async function readToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value ?? null;
}

export function withSession(body: unknown, token: string, req: Request, status = 200): NextResponse {
  const res = NextResponse.json(body, { status });
  res.cookies.set(COOKIE_NAME, token, cookieOptions(req));
  return res;
}

export function clearSession(body: unknown, req: Request): NextResponse {
  const res = NextResponse.json(body);
  res.cookies.set(COOKIE_NAME, "", { ...cookieOptions(req), maxAge: 0 });
  return res;
}
