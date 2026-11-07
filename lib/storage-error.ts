export function storageErrorMessage(error: unknown): string {
  const name = error && typeof error === "object" && "name" in error ? String((error as { name?: unknown }).name ?? "") : "";
  const message = error instanceof Error ? error.message : "";
  if (name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED" || /quota/i.test(`${name} ${message}`)) {
    return "This browser is full. That change did not save. Remove a photo or free space in this browser, then try again. Stamps already saved are still here.";
  }
  if (message) return message;
  return "This browser could not save that. Try again. Stamps already saved are still here.";
}
