import { clearSession, jsonError, readToken } from "@/lib/api";
import { leaveHunt } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const token = await readToken();
    if (token) leaveHunt(token);
    return clearSession({ ok: true }, req);
  } catch (error) {
    return jsonError(error);
  }
}
