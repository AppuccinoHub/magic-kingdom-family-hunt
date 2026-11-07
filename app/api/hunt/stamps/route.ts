import { NextResponse } from "next/server";
import { jsonError, readToken } from "@/lib/api";
import { setStamp } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const token = await readToken();
    if (!token) return NextResponse.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    return NextResponse.json(setStamp(token, body?.index, Boolean(body?.done), body?.memberId));
  } catch (error) {
    return jsonError(error);
  }
}
