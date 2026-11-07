import { jsonError, readToken, clearSession } from "@/lib/api";
import { deleteHunt } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const token = await readToken();
    if (!token) return Response.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    deleteHunt(token, body?.familyName);
    return clearSession({ ok: true }, req);
  } catch (error) {
    return jsonError(error);
  }
}
