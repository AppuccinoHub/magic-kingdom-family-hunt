import { phoneGet, readActive, writeActive, type ActiveHunt } from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";

export async function loadCurrentHunt(): Promise<HuntState | null> {
  const active = readActive();
  if (!active) return null;
  return phoneGet(active.id);
}

export function rememberHunt(active: ActiveHunt | null): void {
  writeActive(active);
}
