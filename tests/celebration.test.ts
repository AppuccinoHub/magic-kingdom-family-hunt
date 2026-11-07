import assert from "node:assert/strict";
import test from "node:test";
import { completionToken, shouldShowFullCelebration } from "../lib/celebration";

const done = (stampedAt: string) => ({ done: true, stampedAt });
const open = { done: false, stampedAt: null };

test("completion token exists only when all 25 are stamped", () => {
  const partial = Array.from({ length: 25 }, (_, index) => (index === 24 ? open : done("t")));
  assert.equal(completionToken(partial), null);
  const full = Array.from({ length: 25 }, (_, index) => done(`t-${index}`));
  assert.equal(completionToken(full), full.map((item) => item.stampedAt).join("|"));
});

test("full celebration appears once on the jump to 25 and not on load or repeat polls", () => {
  const token = "a|b";
  assert.equal(
    shouldShowFullCelebration({ previousCount: null, nextCount: 25, seenToken: null, nextToken: token }),
    false,
  );
  assert.equal(
    shouldShowFullCelebration({ previousCount: 24, nextCount: 25, seenToken: null, nextToken: token }),
    true,
  );
  assert.equal(
    shouldShowFullCelebration({ previousCount: 0, nextCount: 25, seenToken: null, nextToken: token }),
    true,
  );
  assert.equal(
    shouldShowFullCelebration({ previousCount: 25, nextCount: 25, seenToken: token, nextToken: token }),
    false,
  );
  assert.equal(
    shouldShowFullCelebration({ previousCount: 24, nextCount: 25, seenToken: token, nextToken: token }),
    false,
  );
  assert.equal(
    shouldShowFullCelebration({ previousCount: 24, nextCount: 24, seenToken: null, nextToken: null }),
    false,
  );
});

test("a new completion after undo can celebrate again", () => {
  assert.equal(
    shouldShowFullCelebration({ previousCount: 24, nextCount: 25, seenToken: "old", nextToken: "new" }),
    true,
  );
});
