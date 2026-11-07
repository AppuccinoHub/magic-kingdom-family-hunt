import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CHALLENGES } from "../lib/challenges";

const EXACT = [
  "Take a pic with the castle",
  "See if Walt's light is on above the fire station",
  "Ride a Main st vehicle",
  "Find Tramp and Lady's footprints outside of Tony's",
  "Watch the first pitch get thrown at Casey's (10:30)",
  "Watch the flag retreat at 5:30",
  "Find the peanuts in the asphalt",
  "Apply to be a Whiff-sistant at storybook treats",
  "Go to a restaurant with antler decorations",
  "See the characters ride Dumbo at 9:30",
  "Find 3 hidden Pascals outside of the Tangled bathrooms",
  "Ask a Cast member the name of their bat (HM)",
  "Check for a hidden Mickey on the table in the ballroom (HM)",
  "Avoid the poop river! (LS)",
  "Ask the stepsisters who Lucifer's favorite is",
  "Get pixie dusted at Sir Mickey's",
  "Kneel at the Cinderella fountain and watch the crown",
  "Ask Mickey if he did his holiday shopping",
  "Write a letter to Santa (Ye Olde Christmas Shoppe)",
  "Knock on the painting at Momento Mori",
  "Get spit on by a camel in Adventureland",
  "Check out the mosiac in Cinderella castle",
  "Ride Mine Train during Fireworks",
  "Enjoy a dole whip on the people mover",
  "Become a galactic hero on Buzz Lightyear",
];

test("the 25 card lines keep the printed spelling and order", () => {
  assert.deepEqual(CHALLENGES.map((challenge) => challenge.text), EXACT);
  assert.equal(new Set(EXACT).size, 25);
});

test("drawings do not reuse character names or outside image files", () => {
  const art = readFileSync(new URL("../components/art.tsx", import.meta.url), "utf8");
  for (const word of ["Dumbo", "Mickey", "Disney", "Minnie", "Pixar", "copyright"]) {
    assert.equal(art.includes(word), false, word);
  }
  assert.equal(art.includes("<img"), false);
  assert.equal(art.includes(".png"), false);
  assert.equal(art.includes(".jpg"), false);
});
