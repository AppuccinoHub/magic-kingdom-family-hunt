import assert from "node:assert/strict";
import test from "node:test";
import { hasStoredPhoto, storedPhotoToBlob, toStoredPhoto } from "../lib/photo-bytes";
import { storageErrorMessage } from "../lib/storage-error";

test("a photo blob is stored as bytes and can be shown again", async () => {
  const original = new Blob([Uint8Array.from([1, 2, 3, 4])], { type: "image/jpeg" });
  const stored = await toStoredPhoto(original);
  assert.ok(stored);
  assert.equal(stored.mime, "image/jpeg");
  assert.equal(stored.bytes.byteLength, 4);
  assert.equal(hasStoredPhoto(stored), true);
  const shown = storedPhotoToBlob(stored);
  assert.ok(shown);
  assert.equal(shown.type, "image/jpeg");
  assert.equal(shown.size, 4);
  assert.deepEqual(new Uint8Array(await shown.arrayBuffer()), Uint8Array.from([1, 2, 3, 4]));
});

test("an older blob photo is still recognized", () => {
  assert.equal(hasStoredPhoto(new Blob(["picture"])), true);
  assert.equal(hasStoredPhoto(null), false);
  assert.equal(hasStoredPhoto({ mime: "image/png", bytes: new ArrayBuffer(0) }), false);
});

test("a Safari blob storage error does not say the photo was saved", () => {
  const message = storageErrorMessage(new Error("Error preparing Blob/File data to be stored in object store"));
  assert.match(message, /not saved/i);
  assert.doesNotMatch(message, /photo saved/i);
  assert.match(message, /stamps and notes are still here/i);
});

test("a full browser explains that the photo did not save", () => {
  const message = storageErrorMessage(new DOMException("quota", "QuotaExceededError"));
  assert.match(message, /did not save/i);
  assert.match(message, /still here/i);
});
