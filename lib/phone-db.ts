import { avatarById } from "@/lib/avatars";
import { completedLines } from "@/lib/bingo";
import { CHALLENGES } from "@/lib/challenges";
import { hasStoredPhoto, photosForStore, storedPhotoToBlob, type StoredPhoto } from "@/lib/photo-bytes";
import { storageErrorMessage } from "@/lib/storage-error";
import type { ChallengeProgress, HuntState, Member } from "@/lib/types";

const DB_NAME = "mk-family-hunt";
const STORE = "hunts";

export type PhoneChallenge = {
  index: number;
  done: boolean;
  note: string;
  stampedByName: string | null;
  stampedAt: string | null;
};

export type PhoneMember = { id: string; nickname: string; avatar: string };

export type PhoneRecord = {
  id: string;
  rev: number;
  familyName: string;
  advisorName: string;
  createdAt: string;
  meId: string;
  members: PhoneMember[];
  challenges: PhoneChallenge[];
  photos: Record<string, StoredPhoto | Blob>;
};

const ACTIVE_KEY = "mk-active";

export type ActiveHunt = { mode: "phone"; id: string };

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("This phone could not open saved hunts."));
  });
}

function memberView(member: PhoneMember): Member {
  const avatar = avatarById(member.avatar) ?? avatarById("star")!;
  return {
    id: member.id,
    nickname: member.nickname,
    avatar: avatar.id,
    emoji: avatar.emoji,
    avatarLabel: avatar.label,
  };
}

export function recordToState(record: PhoneRecord): HuntState {
  const challenges: ChallengeProgress[] = CHALLENGES.map((_, index) => {
    const row = record.challenges.find((item) => item.index === index);
    return {
      index,
      done: Boolean(row?.done),
      note: row?.note ?? "",
      hasPhoto: hasStoredPhoto(record.photos?.[String(index)]),
      stampedByName: row?.stampedByName ?? null,
      stampedAt: row?.stampedAt ?? null,
    };
  });
  const done = challenges.map((challenge) => challenge.done);
  const members = record.members.map(memberView);
  const me = members.find((member) => member.id === record.meId) ?? members[0];
  return {
    phoneOnly: true,
    rev: record.rev,
    hunt: {
      id: record.id,
      code: "",
      familyName: record.familyName,
      advisorName: record.advisorName,
      createdAt: record.createdAt,
    },
    me,
    members,
    challenges,
    bingoLineCount: completedLines(done).length,
    stampCount: done.filter(Boolean).length,
  };
}

async function put(record: PhoneRecord): Promise<void> {
  record.photos = await photosForStore(record.photos);
  const database = await db();
  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      reject(new Error(storageErrorMessage(error ?? new Error("This browser could not save the hunt."))));
    };
    const tx = database.transaction(STORE, "readwrite");
    const request = tx.objectStore(STORE).put(record);
    request.onerror = () => fail(request.error);
    tx.oncomplete = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    tx.onerror = () => fail(tx.error);
    tx.onabort = () => fail(tx.error);
  });
}

async function read(id: string): Promise<PhoneRecord | null> {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(id);
    request.onsuccess = () => resolve((request.result as PhoneRecord | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("This phone could not open the hunt."));
  });
}

function clean(value: string | undefined, max: number, fallback = ""): string {
  const cleaned = (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || fallback;
}

function requireAvatar(id: string | undefined): string {
  return avatarById(id ?? "star")?.id ?? "star";
}

export async function listPhoneHunts(): Promise<HuntState[]> {
  const database = await db();
  const records = await new Promise<PhoneRecord[]>((resolve, reject) => {
    const tx = database.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result as PhoneRecord[]) ?? []);
    request.onerror = () => reject(request.error ?? new Error("This phone could not open saved hunts."));
  });
  return records
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(recordToState);
}

export async function phoneCreate(input: {
  familyName: string;
  nickname?: string;
  avatar?: string;
  advisorName?: string;
}): Promise<HuntState> {
  const familyName = clean(input.familyName, 60);
  if (!familyName) throw new Error("Type a family name to start.");
  const memberId = crypto.randomUUID();
  const record: PhoneRecord = {
    id: crypto.randomUUID(),
    rev: 1,
    familyName,
    advisorName: clean(input.advisorName, 80),
    createdAt: new Date().toISOString(),
    meId: memberId,
    members: [{ id: memberId, nickname: clean(input.nickname, 24, "Our family"), avatar: requireAvatar(input.avatar) }],
    challenges: CHALLENGES.map((_, index) => ({
      index,
      done: false,
      note: "",
      stampedByName: null,
      stampedAt: null,
    })),
    photos: {},
  };
  await put(record);
  return recordToState(record);
}

async function update(id: string, change: (record: PhoneRecord) => void): Promise<HuntState> {
  const record = await read(id);
  if (!record) throw new Error("This hunt is not saved on this phone.");
  change(record);
  record.rev += 1;
  await put(record);
  return recordToState(record);
}

export function phoneGet(id: string): Promise<HuntState | null> {
  return read(id).then((record) => (record ? recordToState(record) : null));
}

export function phonePhoto(id: string, index: number): Promise<Blob | null> {
  return read(id).then((record) => storedPhotoToBlob(record?.photos?.[String(index)]));
}

export function phoneStamp(id: string, index: number, done: boolean, memberId: string): Promise<HuntState> {
  return update(id, (record) => {
    const challenge = record.challenges.find((item) => item.index === index);
    if (!challenge) throw new Error("That challenge is not on the card.");
    const member = record.members.find((item) => item.id === memberId) ?? record.members[0];
    challenge.done = done;
    challenge.stampedByName = done ? member?.nickname ?? "Our family" : null;
    challenge.stampedAt = done ? new Date().toISOString() : null;
  });
}

export function phoneNote(id: string, index: number, note: string): Promise<HuntState> {
  return update(id, (record) => {
    const challenge = record.challenges.find((item) => item.index === index);
    if (!challenge) throw new Error("That challenge is not on the card.");
    challenge.note = clean(note, 500);
  });
}

export function phoneSavePhoto(id: string, index: number, blob: Blob | null): Promise<HuntState> {
  return update(id, (record) => {
    if (blob) record.photos[String(index)] = blob;
    else delete record.photos[String(index)];
  });
}

export function phoneAddMember(id: string, nickname: string, avatar: string): Promise<HuntState> {
  return update(id, (record) => {
    if (record.members.length >= 30) throw new Error("This hunt already has 30 names.");
    record.members.push({
      id: crypto.randomUUID(),
      nickname: clean(nickname, 24, "Our family"),
      avatar: requireAvatar(avatar),
    });
  });
}

export function phoneUpdateNames(id: string, familyName: string, advisorName: string): Promise<HuntState> {
  return update(id, (record) => {
    const nextName = clean(familyName, 60);
    if (!nextName) throw new Error("The family name cannot be empty.");
    record.familyName = nextName;
    record.advisorName = clean(advisorName, 80);
  });
}

export function phoneReset(id: string, familyName: string): Promise<HuntState> {
  return update(id, (record) => {
    if (clean(familyName, 60).toLocaleLowerCase() !== record.familyName.toLocaleLowerCase()) {
      throw new Error("Type the family name to confirm. Nothing was erased.");
    }
    record.photos = {};
    for (const challenge of record.challenges) {
      challenge.done = false;
      challenge.note = "";
      challenge.stampedByName = null;
      challenge.stampedAt = null;
    }
  });
}

export async function phoneDelete(id: string, familyName: string): Promise<void> {
  const record = await read(id);
  if (!record) return;
  if (clean(familyName, 60).toLocaleLowerCase() !== record.familyName.toLocaleLowerCase()) {
    throw new Error("Type the family name to confirm. Nothing was erased.");
  }
  const database = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("This phone could not delete the hunt."));
  });
}

export function readActive(): ActiveHunt | null {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveHunt;
    if (parsed?.mode === "phone" && typeof parsed.id === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function writeActive(active: ActiveHunt | null): void {
  if (!active) localStorage.removeItem(ACTIVE_KEY);
  else localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
}

export function whoKey(huntId: string): string {
  return `mk-who-${huntId}`;
}
