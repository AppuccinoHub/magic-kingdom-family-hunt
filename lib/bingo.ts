export const BINGO_LINES: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export function completedLines(done: readonly boolean[]): number[][] {
  return BINGO_LINES.filter((line) => line.every((index) => done[index])).map((line) => [...line]);
}

export function lineIndexes(done: readonly boolean[]): Set<number> {
  const set = new Set<number>();
  for (const line of completedLines(done)) {
    for (const index of line) set.add(index);
  }
  return set;
}
