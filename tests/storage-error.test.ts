import assert from "node:assert/strict";
import test from "node:test";
import { storageErrorMessage } from "../lib/storage-error";

test("a full browser gets a plain explanation", () => {
  const error = new DOMException("quota", "QuotaExceededError");
  assert.match(storageErrorMessage(error), /browser is full/);
  assert.match(storageErrorMessage(error), /still here/);
});

test("a known save message is kept", () => {
  assert.equal(storageErrorMessage(new Error("Type a family name to start.")), "Type a family name to start.");
});

test("an empty failure still explains that stamps remain", () => {
  assert.match(storageErrorMessage("nope"), /still here/);
});
