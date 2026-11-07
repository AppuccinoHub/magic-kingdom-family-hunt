import { phoneGet, readActive, writeActive, type ActiveHunt } from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";

export async function readJson<T>(res: Response): Promise<T> {
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error || "The hunt server could not save that.");
  return body as T;
}

export async function loadCurrentHunt(): Promise<HuntState | null> {
  const active = readActive();
  if (active?.mode === "phone") return phoneGet(active.id);
  const res = await fetch("/api/hunt", { cache: "no-store", credentials: "same-origin" });
  if (res.status === 401) return null;
  return readJson<HuntState>(res);
}

export function rememberHunt(active: ActiveHunt | null): void {
  writeActive(active);
}
