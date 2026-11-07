import { NextResponse } from "next/server";
import { jsonError, readToken } from "@/lib/api";
import { removePhoto, savePhoto } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const token = await readToken();
    if (!token) return NextResponse.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    const form = await req.formData();
    const file = form.get("photo");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a photo first." }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    return NextResponse.json(savePhoto(token, form.get("index"), bytes));
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const token = await readToken();
    if (!token) return NextResponse.json({ error: "This phone is not in a hunt yet." }, { status: 401 });
    const index = new URL(req.url).searchParams.get("index");
    return NextResponse.json(removePhoto(token, index));
  } catch (error) {
    return jsonError(error);
  }
}
