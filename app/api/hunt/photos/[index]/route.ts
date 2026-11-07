import { NextResponse } from "next/server";
import { jsonError, readToken } from "@/lib/api";
import { readPhoto } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, context: { params: Promise<{ index: string }> }) {
  try {
    const token = await readToken();
    if (!token) return NextResponse.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    const { index } = await context.params;
    const photo = readPhoto(token, index);
    if (!photo) return NextResponse.json({ error: "No photo is saved for that challenge." }, { status: 404 });
    return new NextResponse(new Uint8Array(photo.bytes), {
      status: 200,
      headers: {
        "Content-Type": photo.type,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
