import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const dir = mkdtempSync(path.join(tmpdir(), "mk-hunt-"));
process.env.HUNT_DATA_DIR = dir;

test("families stay private and stamps can be undone", async () => {
  const store = await import("../lib/store");
  store.resetStoreForTests();
  const first = store.createHunt({ familyName: "The Patel family", nickname: "Grandma", avatar: "crown", advisorName: "" });
  const second = store.createHunt({ familyName: "The Ortiz family", nickname: "Dad", avatar: "star", advisorName: "" });
  assert.notEqual(first.state.hunt.id, second.state.hunt.id);
  assert.equal(first.state.hunt.code.length, 14);
  const stamped = store.setStamp(first.token, 0, true, first.state.me.id);
  assert.equal(stamped.stampCount, 1);
  assert.equal(store.readState(second.token).stampCount, 0);
  assert.equal(store.readState(second.token).hunt.familyName, "The Ortiz family");
  const row = [0, 1, 2, 3, 4];
  let state = stamped;
  for (const index of row.slice(1)) state = store.setStamp(first.token, index, true, first.state.me.id);
  assert.equal(state.bingoLineCount, 1);
  state = store.setStamp(first.token, 4, false, first.state.me.id);
  assert.equal(state.bingoLineCount, 0);
  assert.equal(state.challenges[0].done, true);
  const noted = store.setNote(first.token, 0, "By the roses");
  assert.equal(noted.challenges[0].note, "By the roses");
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x11, 0x22]);
  const withPhoto = store.savePhoto(first.token, 0, jpeg);
  assert.equal(withPhoto.challenges[0].hasPhoto, true);
  const bytes = store.readPhoto(first.token, 0);
  assert.equal(bytes?.type, "image/jpeg");
  assert.equal(store.readPhoto(second.token, 0), null);
  assert.throws(() => store.readPhoto("not-a-real-session-token-value", 0), /not in a hunt/);
  assert.throws(() => store.resetStamps(first.token, "wrong"), /Nothing was erased/);
  const cleared = store.resetStamps(first.token, "the patel family");
  assert.equal(cleared.stampCount, 0);
  assert.equal(cleared.challenges[0].note, "");
  const joined = store.joinHunt({ code: first.state.hunt.code, nickname: "Sam", avatar: "boat" });
  assert.equal(joined.state.hunt.familyName, "The Patel family");
  assert.equal(joined.state.members.length >= 2, true);
});

test.after(() => {
  rmSync(dir, { recursive: true, force: true });
});
