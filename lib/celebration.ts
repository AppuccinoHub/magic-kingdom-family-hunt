export function completionToken(
  challenges: readonly { done: boolean; stampedAt: string | null }[],
): string | null {
  if (challenges.length !== 25 || challenges.some((challenge) => !challenge.done)) return null;
  return challenges.map((challenge) => challenge.stampedAt ?? "").join("|");
}

export function fullCardStorageKey(huntId: string): string {
  return `mk-full-${huntId}`;
}

/** Show the all-found party only on the change into 25 stamps, once per completion. */
export function shouldShowFullCelebration(input: {
  previousCount: number | null;
  nextCount: number;
  seenToken: string | null;
  nextToken: string | null;
}): boolean {
  if (input.nextCount !== 25 || !input.nextToken) return false;
  if (input.previousCount === null || input.previousCount >= 25) return false;
  if (input.seenToken === input.nextToken) return false;
  return true;
}
