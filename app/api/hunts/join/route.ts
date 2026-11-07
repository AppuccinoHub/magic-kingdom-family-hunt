import { NextResponse } from "next/server";
import { clientIp } from "@/lib/cookies";
import { isValidCode } from "@/lib/codes";
import { jsonError, withSession } from "@/lib/api";
import { clearFailures, failureLimit, recordFailure } from "@/lib/rate-limit";
import { HuntError, joinHunt } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  try {
    if (failureLimit("join", ip, 8, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many tries. Wait a few minutes, then try the code again." },
        { status: 429 },
      );
    }
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const code = typeof body?.code === "string" ? body.code : "";
    if (!isValidCode(code)) {
      recordFailure("join", ip, 10 * 60 * 1000);
      return NextResponse.json(
        { error: "That code does not match a hunt. Check the letters and try again." },
        { status: 404 },
      );
    }
    const { token, state } = joinHunt({
      code,
      nickname: body?.nickname,
      avatar: body?.avatar,
    });
    clearFailures("join", ip);
    return withSession(state, token, req, 200);
  } catch (error) {
    if (error instanceof HuntError && error.status === 404) {
      recordFailure("join", ip, 10 * 60 * 1000);
    }
    return jsonError(error);
  }
}
