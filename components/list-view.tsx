"use client";

import { useState } from "react";
import { CHALLENGES } from "@/lib/challenges";
import { challengeImage } from "@/lib/illustrations";
import type { HuntState } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function ListView({
  state,
  onOpen,
  onStamp,
  offline,
  busy,
}: {
  state: HuntState;
  onOpen: (index: number) => void;
  onStamp: (index: number, done: boolean) => void;
  offline: boolean;
  busy: boolean;
}) {
  const [confirm, setConfirm] = useState<number | null>(null);

  return (
    <section className="grid gap-4" aria-labelledby="list-heading">
      <h2 id="list-heading" className="text-3xl font-bold leading-tight">
        Big list
      </h2>
      <p className="text-xl leading-snug">All 25 challenges, in the same order as the card. Read one, do it together, then stamp it.</p>
      <ol className="grid gap-4">
        {state.challenges.map((challenge) => {
          const card = CHALLENGES[challenge.index];
          return (
            <li key={challenge.index} className="min-w-0 rounded-[1.5rem] bg-white p-3 shadow-md">
              <article className="flex min-w-0 items-start gap-3">
                <img src={challengeImage(card.icon)} alt="" className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <p className="text-base font-bold text-[#6b5b4b]">
                    {challenge.index + 1}. {card.iconWord}. {challenge.done ? "Stamped" : "Not yet"}
                  </p>
                  <h3 className="mt-1 break-words text-2xl font-extrabold leading-tight text-ink">{card.text}</h3>
                </div>
              </article>
              <div className="mt-4 grid gap-3">
                <Button onClick={() => onOpen(challenge.index)}>Read the steps</Button>
                {challenge.done ? (
                  confirm === challenge.index ? (
                    <>
                      <p className="text-lg font-bold">Remove this stamp? Your note and photo stay.</p>
                      <Button variant="secondary" onClick={() => { onStamp(challenge.index, false); setConfirm(null); }} disabled={offline || busy}>
                        Yes, remove the stamp
                      </Button>
                      <Button variant="quiet" onClick={() => setConfirm(null)}>
                        Keep the stamp
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" onClick={() => setConfirm(challenge.index)} disabled={offline || busy}>
                      Remove this stamp
                    </Button>
                  )
                ) : (
                  <Button onClick={() => onStamp(challenge.index, true)} disabled={offline || busy} aria-describedby="sync-note">
                    We did it. Add our stamp
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
