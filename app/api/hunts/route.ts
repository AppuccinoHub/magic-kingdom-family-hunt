import { clientIp } from "@/lib/cookies";
import { jsonError, withSession } from "@/lib/api";
import { noteEvent } from "@/lib/rate-limit";
import { createHunt } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (noteEvent("create", clientIp(req), 30, 60 * 60 * 1000)) {
      return Response.json(
        { error: "Too many new hunts from this phone. Wait a while, then try again." },
        { status: 429 },
      );
    }
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const { token, state } = createHunt({
      familyName: body?.familyName,
      nickname: body?.nickname,
      avatar: body?.avatar,
      advisorName: body?.advisorName,
    });
    return withSession(state, token, req, 201);
  } catch (error) {
    return jsonError(error);
  }
}
