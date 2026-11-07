"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BoardView } from "@/components/board-view";
import { DetailView } from "@/components/detail-view";
import { Frame } from "@/components/frame";
import { ListView } from "@/components/list-view";
import { AdvisorLine, ParkNotice, UnofficialNotice } from "@/components/notices";
import { PassportView } from "@/components/passport-view";
import { Button } from "@/components/ui/button";
import { AvatarMark } from "@/components/avatar-mark";
import { FoundEverything } from "@/components/found-everything";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { completionToken, fullCardStorageKey, shouldShowFullCelebration } from "@/lib/celebration";
import {
  phoneAddMember,
  phoneDelete,
  phoneGet,
  phoneNote,
  phonePhoto,
  phoneReset,
  phoneSavePhoto,
  phoneStamp,
  phoneUpdateNames,
  readActive,
  whoKey,
  writeActive,
} from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";

type View = "board" | "list" | "passport";

type Celebrate = { stamps: number; lines: number; newLine: boolean; full: boolean };

export function HuntScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const initialView = params.get("view") === "list" || params.get("view") === "passport" ? (params.get("view") as View) : "board";
  const [state, setState] = useState<HuntState | null>(null);
  const [view, setView] = useState<View>(initialView);
  const [detail, setDetail] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [who, setWho] = useState("");
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sync, setSync] = useState("Checking this browser…");
  const [live, setLive] = useState("");
  const [celebrate, setCelebrate] = useState<Celebrate | null>(null);
  const [fullOpen, setFullOpen] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<Record<number, string>>({});
  const stateRef = useRef<HuntState | null>(null);
  stateRef.current = state;

  function applyState(next: HuntState, source: "load" | "change") {
    const prev = stateRef.current;
    const token = completionToken(next.challenges);
    const seen = window.localStorage.getItem(fullCardStorageKey(next.hunt.id));
    const previousCount = source === "load" || prev?.hunt.id !== next.hunt.id ? null : prev.stampCount;
    if (
      shouldShowFullCelebration({
        previousCount,
        nextCount: next.stampCount,
        seenToken: seen,
        nextToken: token,
      })
    ) {
      window.localStorage.setItem(fullCardStorageKey(next.hunt.id), token ?? "");
      setFullOpen(true);
    }
    stateRef.current = next;
    setState(next);
  }

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const active = readActive();
        if (!active) {
          if (!cancel) setMissing(true);
          return;
        }
        const hunt = await phoneGet(active.id);
        if (cancel) return;
        if (!hunt) {
          setMissing(true);
          return;
        }
        applyState(hunt, "load");
        setSync("Saved in this browser on this device.");
      } catch (err) {
        if (!cancel) setLoadError(err instanceof Error ? err.message : "The hunt could not open.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!state) return;
    const saved = localStorage.getItem(whoKey(state.hunt.id));
    setWho(saved && state.members.some((member) => member.id === saved) ? saved : state.me.id);
  }, [state?.hunt.id, state?.me.id, state?.members]);

  useEffect(() => {
    if (!state) return;
    let cancel = false;
    const created: string[] = [];
    (async () => {
      const next: Record<number, string> = {};
      for (const challenge of state.challenges) {
        if (!challenge.hasPhoto) continue;
        const blob = await phonePhoto(state.hunt.id, challenge.index);
        if (!blob) continue;
        const url = URL.createObjectURL(blob);
        created.push(url);
        next[challenge.index] = url;
      }
      if (cancel) created.forEach((url) => URL.revokeObjectURL(url));
      else setPhotoUrls(next);
    })();
    return () => {
      cancel = true;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [state?.hunt.id, state?.rev, state?.challenges]);

  function chooseWho(id: string) {
    setWho(id);
    if (state) localStorage.setItem(whoKey(state.hunt.id), id);
  }

  function photoSrc(index: number) {
    if (!state?.challenges[index]?.hasPhoto) return undefined;
    return photoUrls[index];
  }

  async function stamp(index: number, done: boolean) {
    if (!state) return;
    setBusy(true);
    setError("");
    const beforeLines = state.bingoLineCount;
    try {
      const next = await phoneStamp(state.hunt.id, index, done, who || state.me.id);
      applyState(next, "change");
      if (done && next.stampCount < 25) {
        setCelebrate({
          stamps: next.stampCount,
          lines: next.bingoLineCount,
          newLine: next.bingoLineCount > beforeLines,
          full: false,
        });
      } else if (!done) {
        setLive(`Stamp removed. ${next.stampCount} of 25 stamps. ${next.bingoLineCount} bingo lines.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The stamp did not save.");
    } finally {
      setBusy(false);
    }
  }

  async function saveNote(index: number, note: string) {
    if (!state) return;
    const next = await phoneNote(state.hunt.id, index, note);
    applyState(next, "change");
  }

  async function savePhoto(index: number, file: File | null) {
    if (!state) return;
    applyState(await phoneSavePhoto(state.hunt.id, index, file), "change");
  }

  async function saveNames(familyName: string, advisorName: string) {
    if (!state) return;
    try {
      applyState(await phoneUpdateNames(state.hunt.id, familyName, advisorName), "change");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The names did not save.");
    }
  }

  async function addMember(nickname: string, avatar: string) {
    if (!state) return;
    try {
      const next = await phoneAddMember(state.hunt.id, nickname, avatar);
      applyState(next, "change");
      const newest = next.members[next.members.length - 1];
      if (newest) chooseWho(newest.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That person did not save.");
    }
  }

  async function reset(familyName: string) {
    if (!state) return;
    try {
      applyState(await phoneReset(state.hunt.id, familyName), "change");
      setLive("Stamps erased from this browser.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The stamps were not erased.");
    }
  }

  async function removeHunt(familyName: string) {
    if (!state) return;
    await phoneDelete(state.hunt.id, familyName);
    writeActive(null);
    router.push("/");
  }

  async function leave() {
    writeActive(null);
    router.push("/");
  }

  if (loading) {
    return (
      <Frame>
        <h1 className="text-4xl font-bold">Opening your hunt…</h1>
      </Frame>
    );
  }

  if (missing || !state) {
    return (
      <Frame>
        <h1 className="text-4xl font-bold">No hunt on this phone yet</h1>
        <p className="mt-3 text-xl">{loadError || "Start a hunt on this phone. Another phone does not have this hunt."}</p>
        <Button asChild className="mt-4">
          <Link href="/">Go to the start</Link>
        </Button>
      </Frame>
    );
  }

  const holder = state.members.find((member) => member.id === who) ?? state.me;

  return (
    <Frame>
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
      <p className="mb-3 rounded-3xl border-4 border-ink bg-lilac p-4 text-xl font-bold leading-snug" role="status">
        Progress and photos stay in this browser on this device. Clearing browser data can erase them. Another phone does not share this progress. Pass this phone around your family.
      </p>
      <p id="sync-note" className="text-lg font-bold" role="status">
        {sync}
      </p>
      <h1 className="mt-2 text-4xl font-bold leading-tight">{state.hunt.familyName}</h1>
      <AdvisorLine name={state.hunt.advisorName} />
      <p className="mt-2 text-2xl font-bold">
        <span data-testid="stamp-count">{state.stampCount}</span> of 25 stamps
      </p>
      <p className="text-2xl font-bold">
        Bingo lines: <span data-testid="bingo-count">{state.bingoLineCount}</span> of 12
      </p>
      <div className="mt-2 flex flex-wrap gap-1" aria-hidden="true">
        {state.challenges.map((challenge) => (
          <span key={challenge.index} className={`inline-block size-4 rounded-full ${challenge.done ? "bg-coral" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-3 rounded-3xl bg-butter p-3 text-xl font-bold">Find all 25 for a big celebration.</p>
      <p className="mt-3 text-lg">
        Who has the phone?{" "}
        <span className="inline-flex items-center gap-2 font-bold">
          <AvatarMark id={holder.avatar} className="h-8 w-8" />
          {holder.nickname}
        </span>
      </p>
      {error ? (
        <p role="alert" className="mt-3 text-xl font-bold text-coral">
          {error}
        </p>
      ) : null}
      {detail === null ? (
        <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="Ways to see the hunt">
          {(
            [
              ["board", "Bingo", "Bingo card"],
              ["list", "Big list", "Big list"],
              ["passport", "Passport", "Passport"],
            ] as const
          ).map(([id, label, name]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-label={name}
              aria-selected={view === id}
              className={`min-h-16 min-w-0 rounded-2xl border-2 px-1 text-base font-bold leading-tight ${view === id ? "border-[#8f241c] bg-coral text-white" : "border-ink bg-paper text-ink"}`}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-4">
        {detail !== null ? (
          <DetailView
            state={state}
            index={detail}
            onBack={() => setDetail(null)}
            onStamp={(index, done) => void stamp(index, done)}
            onNote={saveNote}
            onPhoto={savePhoto}
            photoSrc={photoSrc(detail)}
            offline={false}
            busy={busy}
          />
        ) : view === "list" ? (
          <ListView state={state} onOpen={(index) => { setSelected(index); setDetail(index); }} onStamp={(index, done) => void stamp(index, done)} offline={false} busy={busy} />
        ) : view === "passport" ? (
          <PassportView
            state={state}
            who={who}
            onWho={chooseWho}
            onOpen={(index) => { setSelected(index); setDetail(index); }}
            photoSrc={photoSrc}
            onSaveNames={saveNames}
            onAddMember={addMember}
            onReset={reset}
            onDelete={removeHunt}
            onLeave={leave}
            onReplay={() => setFullOpen(true)}
            offline={false}
            busy={busy}
          />
        ) : (
          <BoardView
            state={state}
            selected={selected}
            onSelect={setSelected}
            onOpen={(index) => setDetail(index)}
            onStamp={(index, done) => void stamp(index, done)}
            offline={false}
            busy={busy}
          />
        )}
      </div>
      <div className="mt-6 grid gap-3">
        <ParkNotice />
        <UnofficialNotice />
      </div>
      <Dialog open={celebrate !== null} onOpenChange={(open) => { if (!open) setCelebrate(null); }}>
        <DialogContent>
          <div className="seal seal-pop" aria-hidden="true">
            Done
          </div>
          <DialogTitle className="mt-3">{celebrate?.newLine ? "Bingo!" : "Stamp saved"}</DialogTitle>
          <DialogDescription>
            {celebrate?.stamps} of 25 stamps. {celebrate?.lines} bingo {celebrate?.lines === 1 ? "line" : "lines"}.
          </DialogDescription>
          {celebrate?.newLine ? (
            <p className="mt-3 text-xl">That stamp finished a line of five. Lines can go across, down, or corner to corner.</p>
          ) : null}
          <Button className="mt-5" onClick={() => setCelebrate(null)}>
            Keep going
          </Button>
        </DialogContent>
      </Dialog>
      <FoundEverything
        open={fullOpen}
        onClose={() => setFullOpen(false)}
        onMemories={() => {
          setFullOpen(false);
          setDetail(null);
          setView("passport");
        }}
      />
    </Frame>
  );
}
