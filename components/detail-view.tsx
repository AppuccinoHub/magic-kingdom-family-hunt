"use client";

import { useEffect, useRef, useState } from "react";
import { CHALLENGES } from "@/lib/challenges";
import { cardTint } from "@/lib/card-style";
import type { ChallengeProgress, HuntState } from "@/lib/types";
import { challengeImage } from "@/lib/illustrations";
import { InkStamp } from "@/components/ink-stamp";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { shrinkPhoto } from "@/lib/photos";

export function DetailView({
  state,
  index,
  onBack,
  hideBack = false,
  onStamp,
  onNote,
  onPhoto,
  photoSrc,
  offline,
  busy,
}: {
  state: HuntState;
  index: number;
  onBack: () => void;
  hideBack?: boolean;
  onStamp: (index: number, done: boolean) => void;
  onNote: (index: number, note: string) => Promise<void>;
  onPhoto: (index: number, file: File | null) => Promise<void>;
  photoSrc?: string;
  offline: boolean;
  busy: boolean;
}) {
  const card = CHALLENGES[index];
  const progress: ChallengeProgress = state.challenges[index];
  const [note, setNote] = useState(progress.note);
  const [noteMessage, setNoteMessage] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");
  const [confirmUndo, setConfirmUndo] = useState(false);
  const [confirmPhoto, setConfirmPhoto] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    dirty.current = false;
    setNote(progress.note);
    setNoteMessage("");
    setPhotoMessage("");
    setConfirmUndo(false);
    setConfirmPhoto(false);
  }, [index]);

  useEffect(() => {
    if (!dirty.current) setNote(progress.note);
  }, [progress.note]);

  async function saveNote() {
    setNoteMessage("");
    try {
      await onNote(index, note);
      dirty.current = false;
      setNoteMessage("Note saved in this browser.");
    } catch (error) {
      setNoteMessage(error instanceof Error ? error.message : "That note did not save.");
    }
  }

  async function onFile(file: File | null) {
    if (!file) return;
    setPhotoMessage("");
    try {
      const blob = await shrinkPhoto(file);
      const shrunk = new File([blob], "memory.jpg", { type: blob.type || "image/jpeg" });
      await onPhoto(index, shrunk);
      setPhotoMessage("Photo saved in this browser. It is not in your camera roll.");
    } catch (error) {
      setPhotoMessage(error instanceof Error ? error.message : "That photo did not save.");
    }
  }

  return (
    <article className="grid gap-4">
      {hideBack ? null : (
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      )}
      <p className="text-lg font-bold">
        Challenge {index + 1} of 25. {card.iconWord}. {progress.done ? "Stamped." : "Not yet."}
      </p>
      <div className={`grid min-w-0 grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 rounded-3xl border-4 border-ink p-3 ${cardTint(index)}`}>
        <img src={challengeImage(card.icon)} alt="" className="h-32 w-full rounded-2xl object-cover" />
        <div className="flex min-w-0 flex-col items-center gap-1">
          <InkStamp
            icon={card.icon}
            label={card.iconWord}
            earned={progress.done}
            index={index}
            className="h-28 w-28"
          />
          <p className="text-center text-base font-bold leading-tight">{card.iconWord}</p>
        </div>
      </div>
      <p className="text-lg font-bold">Words on the card</p>
      <h2 className="break-words text-2xl font-bold leading-tight" data-testid="card-words">
        {card.text}
      </h2>
      <p className="text-lg">These are the card’s words. The spelling and punctuation are unchanged.</p>
      <section className="rounded-3xl border-2 border-ink bg-cream p-4" aria-labelledby="steps-heading">
        <h3 id="steps-heading" className="text-lg font-bold">
          How to do this
        </h3>
        <ol className="mt-2 grid list-decimal gap-2 pl-5 text-base leading-snug">
          {card.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      {card.parkNote ? (
        <p className="rounded-2xl border-2 border-gold bg-gold-soft p-4 text-xl font-bold leading-snug">
          Check at the park. {card.parkNote}
        </p>
      ) : null}
      <p className="text-lg">Stamp this when your family agrees you did it. You can undo it later.</p>
      {progress.done ? (
        <div className="grid gap-3 rounded-3xl border-4 border-moss bg-paper p-4">
          <p className="text-2xl font-bold text-moss">Stamped{progress.stampedByName ? ` by ${progress.stampedByName}` : ""}.</p>
          {confirmUndo ? (
            <>
              <p className="text-xl">Remove this stamp? Your note and photo stay.</p>
              <Button variant="secondary" onClick={() => onStamp(index, false)} disabled={offline || busy}>
                Yes, remove the stamp
              </Button>
              <Button variant="quiet" onClick={() => setConfirmUndo(false)}>
                Keep the stamp
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setConfirmUndo(true)} disabled={offline || busy}>
              Remove this stamp
            </Button>
          )}
        </div>
      ) : (
        <Button size="tall" onClick={() => onStamp(index, true)} disabled={offline || busy} aria-describedby="sync-note">
          We did it. Add our stamp
        </Button>
      )}
      <section className="grid gap-3" aria-labelledby="note-heading">
        <h3 id="note-heading" className="text-2xl font-bold">
          Note
        </h3>
        <p id="note-hint" className="text-lg">
          Optional. A memory for your passport. The note stays in this browser on this device. Clearing browser data can erase it.
        </p>
        <Textarea
          aria-label="Note for this challenge"
          aria-describedby="note-hint"
          maxLength={500}
          value={note}
          onChange={(event) => {
            dirty.current = true;
            setNote(event.target.value);
          }}
        />
        <Button variant="secondary" onClick={() => void saveNote()} disabled={offline || busy}>
          Save note
        </Button>
        {noteMessage ? (
          <p role="status" className="text-lg font-bold">
            {noteMessage}
          </p>
        ) : null}
      </section>
      <section className="grid gap-3" aria-labelledby="photo-heading">
        <h3 id="photo-heading" className="text-2xl font-bold">
          Photo
        </h3>
        <p className="text-lg">
          Optional. The picture stays in this browser on this device. It is not saved to your camera roll. Clearing this browser’s data can erase it.
        </p>
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoSrc} alt={`Photo for challenge ${index + 1}`} className="max-h-80 w-full rounded-2xl border-2 border-ink object-contain" />
        ) : (
          <p className="text-lg">No photo yet.</p>
        )}
        <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border-2 border-ink bg-paper px-3 text-center text-base font-bold">
          Add a photo
          <input data-testid="photo-input" className="sr-only" type="file" accept="image/*" onChange={(event) => void onFile(event.target.files?.[0] ?? null)} />
        </label>
        <label className="flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border-2 border-ink bg-cream px-3 text-center text-base font-bold">
          Use the camera
          <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={(event) => void onFile(event.target.files?.[0] ?? null)} />
        </label>
        {progress.hasPhoto ? (
          confirmPhoto ? (
            <>
              <p className="text-lg font-bold">Remove this photo?</p>
              <Button variant="secondary" onClick={() => { void onPhoto(index, null); setConfirmPhoto(false); }} disabled={offline || busy}>
                Yes, remove the photo
              </Button>
              <Button variant="quiet" onClick={() => setConfirmPhoto(false)}>
                Keep the photo
              </Button>
            </>
          ) : (
            <Button variant="quiet" onClick={() => setConfirmPhoto(true)} disabled={offline || busy}>
              Remove photo
            </Button>
          )
        ) : null}
        {photoMessage ? (
          <p role="status" className="text-lg font-bold">
            {photoMessage}
          </p>
        ) : null}
      </section>
    </article>
  );
}
