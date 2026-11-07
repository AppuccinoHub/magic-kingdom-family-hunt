import assert from "node:assert/strict";
import test from "node:test";
import { BINGO_LINES, completedLines } from "../lib/bingo";

function card(on: number[]): boolean[] {
  const done = Array.from({ length: 25 }, () => false);
  for (const index of on) done[index] = true;
  return done;
}

test("rows, columns, and both diagonals are the only lines", () => {
  assert.equal(BINGO_LINES.length, 12);
  assert.equal(completedLines(card([])).length, 0);
  assert.equal(completedLines(card([0, 1, 2, 3, 4])).length, 1);
  assert.equal(completedLines(card([0, 5, 10, 15, 20])).length, 1);
  assert.equal(completedLines(card([0, 6, 12, 18, 24])).length, 1);
  assert.equal(completedLines(card([4, 8, 12, 16, 20])).length, 1);
  const rowAndColumn = completedLines(card([0, 1, 2, 3, 4, 5, 10, 15, 20]));
  assert.equal(rowAndColumn.length, 2);
  assert.equal(completedLines(Array.from({ length: 25 }, () => true)).length, 12);
  assert.equal(completedLines(card([1, 2, 3, 4])).length, 0);
});
