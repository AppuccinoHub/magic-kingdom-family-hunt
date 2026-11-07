import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { avatarById } from "@/lib/avatars";
import { completedLines } from "@/lib/bingo";
import { CHALLENGES } from "@/lib/challenges";
import { formatCode, generateCode, normalizeCode } from "@/lib/codes";
import type { ChallengeProgress, HuntState, Member } from "@/lib/types";

export class HuntError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Session = { huntId: string; memberId: string };

let db: DatabaseSync | null = null;

export function dataDir(): string {
  return process.env.HUNT_DATA_DIR || path.join(process.cwd(), "data");
}

function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(dataDir(), { recursive: true });
  const next = new DatabaseSync(path.join(dataDir(), "hunt.db"));
  next.prepare("PRAGMA journal_mode = WAL").get();
  next.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS hunts (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      family_name TEXT NOT NULL,
      advisor_name TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      rev INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      hunt_id TEXT NOT NULL,
      nickname TEXT NOT NULL,
      avatar TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (hunt_id) REFERENCES hunts(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      hunt_id TEXT NOT NULL,
      member_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (hunt_id) REFERENCES hunts(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS progress (
      hunt_id TEXT NOT NULL,
      challenge_index INTEGER NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      note TEXT NOT NULL DEFAULT '',
      has_photo INTEGER NOT NULL DEFAULT 0,
      photo_type TEXT,
      stamped_by_name TEXT,
      stamped_at TEXT,
      PRIMARY KEY (hunt_id, challenge_index),
      FOREIGN KEY (hunt_id) REFERENCES hunts(id) ON DELETE CASCADE
    );
  `);
  db = next;
  return next;
}

export function resetStoreForTests(): void {
  if (db) db.close();
  db = null;
}

function transaction(fn: () => void): void {
  const database = getDb();
  database.exec("BEGIN IMMEDIATE");
  try {
    fn();
    database.exec("COMMIT");
  } catch (error) {
    try {
      database.exec("ROLLBACK");
    } catch {
      /* already closed by the original error */
    }
    throw error;
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function newToken(): string {
  return randomBytes(32).toString("hex");
}

export function cleanName(value: unknown, max: number, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.replace(/\u0000/g, "").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, max);
}

function memberFromRow(row: { id: string; nickname: string; avatar: string }): Member {
  const avatar = avatarById(row.avatar) ?? avatarById("star")!;
  return {
    id: row.id,
    nickname: row.nickname,
    avatar: avatar.id,
    emoji: avatar.emoji,
    avatarLabel: avatar.label,
  };
}

function requireAvatar(value: unknown): string {
  const id = typeof value === "string" ? value : "star";
  const avatar = avatarById(id);
  if (!avatar) throw new HuntError(400, "Please pick a picture from the list.");
  return avatar.id;
}

function bump(huntId: string): void {
  getDb().prepare("UPDATE hunts SET rev = rev + 1 WHERE id = ?").run(huntId);
}

function photoDir(huntId: string): string {
  return path.join(dataDir(), "photos", huntId);
}

function photoExtensions(): Record<string, string> {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
}

export function sessionFromToken(token: string | undefined | null): Session | null {
  if (!token || token.length < 32) return null;
  const row = getDb()
    .prepare("SELECT hunt_id, member_id FROM sessions WHERE token_hash = ?")
    .get(hashToken(token)) as { hunt_id: string; member_id: string } | undefined;
  if (!row) return null;
  return { huntId: row.hunt_id, memberId: row.member_id };
}

export function readState(token: string): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  return stateFor(session.huntId, session.memberId);
}

function stateFor(huntId: string, memberId: string): HuntState {
  const hunt = getDb()
    .prepare("SELECT id, code, family_name, advisor_name, created_at, rev FROM hunts WHERE id = ?")
    .get(huntId) as
    | {
        id: string;
        code: string;
        family_name: string;
        advisor_name: string;
        created_at: string;
        rev: number;
      }
    | undefined;
  if (!hunt) throw new HuntError(401, "This phone is not in a hunt yet.");
  const memberRows = getDb()
    .prepare("SELECT id, nickname, avatar FROM members WHERE hunt_id = ? ORDER BY created_at ASC")
    .all(huntId) as { id: string; nickname: string; avatar: string }[];
  const members = memberRows.map(memberFromRow);
  const me = members.find((member) => member.id === memberId) ?? members[0];
  if (!me) throw new HuntError(401, "This phone is not in a hunt yet.");
  const progress = getDb()
    .prepare(
      `SELECT challenge_index, done, note, has_photo, stamped_by_name, stamped_at
       FROM progress WHERE hunt_id = ? ORDER BY challenge_index ASC`,
    )
    .all(huntId) as {
    challenge_index: number;
    done: number;
    note: string;
    has_photo: number;
    stamped_by_name: string | null;
    stamped_at: string | null;
  }[];
  const challenges: ChallengeProgress[] = CHALLENGES.map((_, index) => {
    const row = progress.find((item) => item.challenge_index === index);
    return {
      index,
      done: Boolean(row?.done),
      note: row?.note ?? "",
      hasPhoto: Boolean(row?.has_photo),
      stampedByName: row?.stamped_by_name ?? null,
      stampedAt: row?.stamped_at ?? null,
    };
  });
  const done = challenges.map((challenge) => challenge.done);
  return {
    phoneOnly: false,
    rev: Number(hunt.rev),
    hunt: {
      id: hunt.id,
      code: formatCode(hunt.code),
      familyName: hunt.family_name,
      advisorName: hunt.advisor_name,
      createdAt: hunt.created_at,
    },
    me,
    members,
    challenges,
    bingoLineCount: completedLines(done).length,
    stampCount: done.filter(Boolean).length,
  };
}

function addMember(huntId: string, nickname: string, avatar: string): string {
  const count = getDb().prepare("SELECT COUNT(*) AS n FROM members WHERE hunt_id = ?").get(huntId) as { n: number };
  if (Number(count.n) >= 30) {
    throw new HuntError(400, "This hunt already has 30 names. Use a phone that is already in the hunt.");
  }
  const id = randomUUID();
  getDb()
    .prepare("INSERT INTO members (id, hunt_id, nickname, avatar, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(id, huntId, nickname, avatar, new Date().toISOString());
  return id;
}

function nicknameOrDefault(value: unknown): string {
  const nickname = cleanName(value, 24);
  return nickname || "Our family";
}

export function createHunt(input: { familyName: unknown; nickname: unknown; avatar: unknown; advisorName: unknown }): {
  token: string;
  state: HuntState;
} {
  const familyName = cleanName(input.familyName, 60);
  if (!familyName) throw new HuntError(400, "Type a family name to start.");
  const advisorName = cleanName(input.advisorName, 80);
  const nickname = nicknameOrDefault(input.nickname);
  const avatar = requireAvatar(input.avatar);
  const huntId = randomUUID();
  const code = generateCode();
  const createdAt = new Date().toISOString();
  let memberId = "";
  const token = newToken();
  transaction(() => {
    getDb()
      .prepare("INSERT INTO hunts (id, code, family_name, advisor_name, created_at, rev) VALUES (?, ?, ?, ?, ?, 1)")
      .run(huntId, code, familyName, advisorName, createdAt);
    memberId = addMember(huntId, nickname, avatar);
    for (let index = 0; index < CHALLENGES.length; index += 1) {
      getDb()
        .prepare("INSERT INTO progress (hunt_id, challenge_index, done, note, has_photo) VALUES (?, ?, 0, '', 0)")
        .run(huntId, index);
    }
    getDb()
      .prepare("INSERT INTO sessions (token_hash, hunt_id, member_id, created_at) VALUES (?, ?, ?, ?)")
      .run(hashToken(token), huntId, memberId, createdAt);
  });
  return { token, state: stateFor(huntId, memberId) };
}

export function joinHunt(input: { code: unknown; nickname: unknown; avatar: unknown }): { token: string; state: HuntState } {
  const raw = typeof input.code === "string" ? normalizeCode(input.code) : "";
  const hunt = getDb().prepare("SELECT id FROM hunts WHERE code = ?").get(raw) as { id: string } | undefined;
  if (!hunt) throw new HuntError(404, "That code does not match a hunt. Check the letters and try again.");
  const nickname = nicknameOrDefault(input.nickname);
  const avatar = requireAvatar(input.avatar);
  const token = newToken();
  let memberId = "";
  transaction(() => {
    memberId = addMember(hunt.id, nickname, avatar);
    getDb()
      .prepare("INSERT INTO sessions (token_hash, hunt_id, member_id, created_at) VALUES (?, ?, ?, ?)")
      .run(hashToken(token), hunt.id, memberId, new Date().toISOString());
    bump(hunt.id);
  });
  return { token, state: stateFor(hunt.id, memberId) };
}

function memberInHunt(huntId: string, memberId: string): Member | null {
  const row = getDb()
    .prepare("SELECT id, nickname, avatar FROM members WHERE id = ? AND hunt_id = ?")
    .get(memberId, huntId) as { id: string; nickname: string; avatar: string } | undefined;
  return row ? memberFromRow(row) : null;
}

function indexOf(value: unknown): number {
  const index = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(index) || index < 0 || index >= CHALLENGES.length) {
    throw new HuntError(400, "That challenge is not on the card.");
  }
  return index;
}

export function setStamp(token: string, indexValue: unknown, done: boolean, memberIdValue: unknown): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const index = indexOf(indexValue);
  const requested = typeof memberIdValue === "string" ? memberIdValue : session.memberId;
  const member = memberInHunt(session.huntId, requested) ?? memberInHunt(session.huntId, session.memberId);
  if (!member) throw new HuntError(401, "This phone is not in a hunt yet.");
  transaction(() => {
    if (done) {
      getDb()
        .prepare(
          `UPDATE progress
           SET done = 1, stamped_by_name = ?, stamped_at = ?
           WHERE hunt_id = ? AND challenge_index = ?`,
        )
        .run(member.nickname, new Date().toISOString(), session.huntId, index);
    } else {
      getDb()
        .prepare(
          `UPDATE progress
           SET done = 0, stamped_by_name = NULL, stamped_at = NULL
           WHERE hunt_id = ? AND challenge_index = ?`,
        )
        .run(session.huntId, index);
    }
    bump(session.huntId);
  });
  return stateFor(session.huntId, session.memberId);
}

export function setNote(token: string, indexValue: unknown, noteValue: unknown): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const index = indexOf(indexValue);
  const note = cleanName(noteValue, 500);
  transaction(() => {
    getDb()
      .prepare("UPDATE progress SET note = ? WHERE hunt_id = ? AND challenge_index = ?")
      .run(note, session.huntId, index);
    bump(session.huntId);
  });
  return stateFor(session.huntId, session.memberId);
}

function detectPhoto(bytes: Buffer): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

function deletePhotoFiles(huntId: string, index: number): void {
  const dir = photoDir(huntId);
  for (const ext of Object.values(photoExtensions())) {
    rmSync(path.join(dir, `${index}.${ext}`), { force: true });
  }
}

export function savePhoto(token: string, indexValue: unknown, bytes: Buffer): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const index = indexOf(indexValue);
  if (bytes.length === 0 || bytes.length > 2_500_000) {
    throw new HuntError(413, "That photo is too big. Try a smaller one.");
  }
  const type = detectPhoto(bytes);
  if (!type) throw new HuntError(400, "Please use a photo from your camera.");
  const ext = photoExtensions()[type];
  const dir = photoDir(session.huntId);
  mkdirSync(dir, { recursive: true });
  deletePhotoFiles(session.huntId, index);
  writeFileSync(path.join(dir, `${index}.${ext}`), bytes);
  transaction(() => {
    getDb()
      .prepare("UPDATE progress SET has_photo = 1, photo_type = ? WHERE hunt_id = ? AND challenge_index = ?")
      .run(type, session.huntId, index);
    bump(session.huntId);
  });
  return stateFor(session.huntId, session.memberId);
}

export function removePhoto(token: string, indexValue: unknown): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const index = indexOf(indexValue);
  deletePhotoFiles(session.huntId, index);
  transaction(() => {
    getDb()
      .prepare("UPDATE progress SET has_photo = 0, photo_type = NULL WHERE hunt_id = ? AND challenge_index = ?")
      .run(session.huntId, index);
    bump(session.huntId);
  });
  return stateFor(session.huntId, session.memberId);
}

export function readPhoto(token: string, indexValue: unknown): { bytes: Buffer; type: string } | null {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const index = indexOf(indexValue);
  const row = getDb()
    .prepare("SELECT has_photo, photo_type FROM progress WHERE hunt_id = ? AND challenge_index = ?")
    .get(session.huntId, index) as { has_photo: number; photo_type: string | null } | undefined;
  if (!row?.has_photo || !row.photo_type) return null;
  const ext = photoExtensions()[row.photo_type];
  if (!ext) return null;
  const file = path.join(photoDir(session.huntId), `${index}.${ext}`);
  try {
    return { bytes: readFileSync(file), type: row.photo_type };
  } catch {
    return null;
  }
}

export function addPerson(token: string, nicknameValue: unknown, avatarValue: unknown): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const nickname = nicknameOrDefault(nicknameValue);
  const avatar = requireAvatar(avatarValue);
  transaction(() => {
    addMember(session.huntId, nickname, avatar);
    bump(session.huntId);
  });
  return stateFor(session.huntId, session.memberId);
}

export function updateHunt(token: string, familyNameValue: unknown, advisorNameValue: unknown): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  const current = stateFor(session.huntId, session.memberId);
  const familyName = familyNameValue === undefined ? current.hunt.familyName : cleanName(familyNameValue, 60);
  if (!familyName) throw new HuntError(400, "The family name cannot be empty.");
  const advisorName = advisorNameValue === undefined ? current.hunt.advisorName : cleanName(advisorNameValue, 80);
  transaction(() => {
    getDb().prepare("UPDATE hunts SET family_name = ?, advisor_name = ? WHERE id = ?").run(familyName, advisorName, session.huntId);
    bump(session.huntId);
  });
  return stateFor(session.huntId, session.memberId);
}

function familyMatches(huntId: string, typed: unknown): void {
  const hunt = getDb().prepare("SELECT family_name FROM hunts WHERE id = ?").get(huntId) as { family_name: string };
  const given = cleanName(typed, 60);
  if (given.toLocaleLowerCase() !== hunt.family_name.toLocaleLowerCase()) {
    throw new HuntError(400, "Type the family name to confirm. Nothing was erased.");
  }
}

export function resetStamps(token: string, familyName: unknown): HuntState {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  familyMatches(session.huntId, familyName);
  transaction(() => {
    getDb()
      .prepare(
        `UPDATE progress
         SET done = 0, note = '', has_photo = 0, photo_type = NULL, stamped_by_name = NULL, stamped_at = NULL
         WHERE hunt_id = ?`,
      )
      .run(session.huntId);
    bump(session.huntId);
  });
  rmSync(photoDir(session.huntId), { recursive: true, force: true });
  return stateFor(session.huntId, session.memberId);
}

export function deleteHunt(token: string, familyName: unknown): void {
  const session = sessionFromToken(token);
  if (!session) throw new HuntError(401, "This phone is not in a hunt yet.");
  familyMatches(session.huntId, familyName);
  const huntId = session.huntId;
  transaction(() => {
    getDb().prepare("DELETE FROM hunts WHERE id = ?").run(huntId);
  });
  rmSync(photoDir(huntId), { recursive: true, force: true });
}

export function leaveHunt(token: string): void {
  const session = sessionFromToken(token);
  if (!session) return;
  getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
}
