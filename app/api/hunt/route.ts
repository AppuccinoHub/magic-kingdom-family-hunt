import { NextResponse } from "next/server";
import { jsonError, readToken } from "@/lib/api";
import { readState, updateHunt } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = await readToken();
    if (!token) return NextResponse.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    return NextResponse.json(readState(token));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const token = await readToken();
    if (!token) return NextResponse.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    return NextResponse.json(updateHunt(token, body?.familyName, body?.advisorName));
  } catch (error) {
    return jsonError(error);
  }
}
