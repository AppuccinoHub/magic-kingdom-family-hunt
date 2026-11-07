"use client";

import Link from "next/link";
import { CHALLENGES } from "@/lib/challenges";
import { formatWhen } from "@/lib/utils";
import type { HuntState } from "@/lib/types";
import { AdvisorLine, ParkNotice, UnofficialNotice } from "@/components/notices";
import { Button } from "@/components/ui/button";

export function CertificateView({ state, photoSrc }: { state: HuntState; photoSrc: (index: number) => string | undefined }) {
  const stamped = state.challenges.filter((challenge) => challenge.done);
  const full = stamped.length === 25;
  return (
    <article className="print-sheet grid gap-4">
      <p className="font-display text-2xl text-coral">Adventure passport</p>
      <h1 className="font-display text-5xl leading-none">{full ? "Full card complete" : "Family memory certificate"}</h1>
      <p className="text-3xl font-bold">{state.hunt.familyName}</p>
      <AdvisorLine name={state.hunt.advisorName} />
      <p className="text-xl">
        {stamped.length} of 25 stamps. {state.bingoLineCount} of 12 bingo lines.
      </p>
      <p className="text-lg">Printed {formatWhen(new Date().toISOString())}. This souvenir is for your family.</p>
      {stamped.length === 0 ? (
        <p className="text-2xl font-bold">You do not have stamps yet. Go play, then come back.</p>
      ) : (
        <ol className="grid gap-4">
          {stamped.map((challenge) => {
            const src = photoSrc(challenge.index);
            return (
              <li key={challenge.index} className="border-t-2 border-line pt-3">
                <p className="text-lg font-bold">
                  {challenge.index + 1}. {challenge.stampedByName ? `Stamped by ${challenge.stampedByName}` : "Stamped"}
                  {challenge.stampedAt ? ` · ${formatWhen(challenge.stampedAt)}` : ""}
                </p>
                <p className="text-2xl font-bold leading-tight">{CHALLENGES[challenge.index].text}</p>
                {challenge.note ? <p className="text-xl">Note: {challenge.note}</p> : null}
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`Photo for challenge ${challenge.index + 1}`} className="mt-2 max-h-48 rounded-xl border-2 border-ink" />
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
      <ParkNotice />
      <p className="text-lg">Park times printed on the original card should be checked at the park. This certificate does not set a schedule.</p>
      <UnofficialNotice />
      <div className="no-print grid gap-3">
        <Button onClick={() => window.print()}>Print or save as PDF</Button>
        <Button asChild variant="secondary">
          <Link href="/hunt?view=passport">Back to the passport</Link>
        </Button>
      </div>
    </article>
  );
}
