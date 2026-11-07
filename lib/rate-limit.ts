type Bucket = { start: number; count: number };

const buckets = new Map<string, Bucket>();

function bucket(name: string, key: string, windowMs: number): Bucket {
  const id = `${name}:${key}`;
  const now = Date.now();
  const current = buckets.get(id);
  if (!current || now - current.start > windowMs) {
    const fresh = { start: now, count: 0 };
    buckets.set(id, fresh);
    return fresh;
  }
  return current;
}

export function noteEvent(name: string, key: string, limit: number, windowMs: number): boolean {
  const row = bucket(name, key, windowMs);
  if (row.count >= limit) return true;
  row.count += 1;
  return false;
}

export function failureLimit(name: string, key: string, limit: number, windowMs: number): boolean {
  return bucket(name, key, windowMs).count >= limit;
}

export function recordFailure(name: string, key: string, windowMs: number): void {
  const row = bucket(name, key, windowMs);
  row.count += 1;
}

export function clearFailures(name: string, key: string): void {
  buckets.delete(`${name}:${key}`);
}

export function resetRateLimitsForTests(): void {
  buckets.clear();
}
