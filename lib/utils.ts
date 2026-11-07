import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function namesMatch(typed: string, actual: string): boolean {
  return typed.trim().toLocaleLowerCase() === actual.trim().toLocaleLowerCase() && actual.trim().length > 0;
}

export function formatWhen(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}
