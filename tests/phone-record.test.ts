import assert from "node:assert/strict";
import test from "node:test";
import { CHALLENGES } from "../lib/challenges";
import { recordToState, type PhoneRecord } from "../lib/phone-db";

function record(id: string, doneThrough: number): PhoneRecord {
  return {
    id,
    rev: 1,
    familyName: id === "a" ? "The Patel family" : "The Ortiz family",
    advisorName: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    meId: "m",
    members: [{ id: "m", nickname: "Grandma", avatar: "star" }],
    challenges: CHALLENGES.map((_, index) => ({
      index,
      done: index < doneThrough,
      note: index === 0 && id === "a" ? "By the roses" : "",
      stampedByName: index < doneThrough ? "Grandma" : null,
      stampedAt: index < doneThrough ? "2026-01-01T00:00:01.000Z" : null,
    })),
    photos: id === "a" ? { "0": new Blob(["picture"]) } : {},
  };
}

test("one phone's stamps and photo stay on that record", () => {
  const patel = recordToState(record("a", 5));
  const ortiz = recordToState(record("b", 0));
  assert.equal(patel.phoneOnly, true);
  assert.equal(patel.hunt.code, "");
  assert.equal(patel.stampCount, 5);
  assert.equal(patel.bingoLineCount, 1);
  assert.equal(patel.challenges[0].note, "By the roses");
  assert.equal(patel.challenges[0].hasPhoto, true);
  assert.equal(ortiz.stampCount, 0);
  assert.equal(ortiz.challenges[0].hasPhoto, false);
  assert.equal(ortiz.hunt.familyName, "The Ortiz family");
  assert.equal(CHALLENGES.length, 25);
  assert.equal(CHALLENGES[0].text, "Take a pic with the castle");
});
