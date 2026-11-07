import { CHALLENGES } from "@/lib/challenges";
import { lineIndexes } from "@/lib/bingo";
import { cardTint } from "@/lib/card-style";
import type { HuntState } from "@/lib/types";
import { CollectibleStamp } from "@/components/art";
import { Button } from "@/components/ui/button";

export function BoardView({
  state,
  selected,
  onSelect,
  onOpen,
  onStamp,
  offline,
  busy,
}: {
  state: HuntState;
  selected: number;
  onSelect: (index: number) => void;
  onOpen: (index: number) => void;
  onStamp: (index: number, done: boolean) => void;
  offline: boolean;
  busy: boolean;
}) {
  const done = state.challenges.map((challenge) => challenge.done);
  const lines = lineIndexes(done);
  const current = state.challenges[selected];
  const card = CHALLENGES[selected];
  const row = Math.floor(selected / 5) + 1;

  return (
    <section className="grid gap-4" aria-labelledby="board-heading">
      <div>
        <h2 id="board-heading" className="text-3xl font-bold leading-tight">
          Bingo card
        </h2>
        <p className="mt-2 text-xl leading-snug">
          The words for the selected square are big. Five in a line makes a bingo. Lines can go across, down, or corner to corner.
        </p>
      </div>
      <article className={`rounded-3xl border-4 border-ink p-4 ${cardTint(selected)}`}>
        <p className="text-lg font-bold">
          Square {selected + 1} of 25. Row {row}. {current.done ? "Stamped." : "Not yet."}
          {lines.has(selected) ? " In a bingo line." : ""}
        </p>
        <div className="mt-3 flex min-w-0 items-center gap-3">
          <CollectibleStamp name={card.icon} found={current.done} className="h-32 w-28 shrink-0" />
          <p className="text-xl font-bold">{card.iconWord}</p>
        </div>
        <p className="mt-3 break-words text-4xl font-bold leading-tight">{card.text}</p>
        <div className="mt-4 grid gap-3">
          <Button size="tall" onClick={() => onOpen(selected)}>
            Read the steps
          </Button>
          {current.done ? (
            <Button variant="secondary" onClick={() => onOpen(selected)} disabled={offline || busy}>
              This one is stamped. Open it
            </Button>
          ) : (
            <Button size="tall" onClick={() => onStamp(selected, true)} disabled={offline || busy} aria-describedby="sync-note">
              We did it. Add our stamp
            </Button>
          )}
        </div>
      </article>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => onSelect(Math.max(0, selected - 1))} disabled={selected === 0}>
          Previous square
        </Button>
        <Button variant="secondary" onClick={() => onSelect(Math.min(24, selected + 1))} disabled={selected === 24}>
          Next square
        </Button>
      </div>
      <p className="text-lg font-bold">All 25 squares</p>
      <div role="group" aria-label="Bingo card, 5 by 5" className="grid grid-cols-5 gap-1.5">
        {state.challenges.map((challenge) => {
          const text = CHALLENGES[challenge.index].text;
          const inLine = lines.has(challenge.index);
          const status = inLine ? "Line" : challenge.done ? "Done" : "Open";
          return (
            <button
              key={challenge.index}
              type="button"
              aria-pressed={selected === challenge.index}
              onClick={() => onSelect(challenge.index)}
              className={`bingo-cell flex min-h-16 flex-col items-center justify-center rounded-xl border-2 px-0.5 py-1 text-center font-bold leading-none ${selected === challenge.index ? "border-night bg-butter" : "border-ink bg-paper"} ${cardTint(challenge.index)}`}
            >
              <CollectibleStamp name={CHALLENGES[challenge.index].icon} compact className="h-7 w-7" />
              <span aria-hidden="true" className="bingo-status">
                {status}
              </span>
              <span className="sr-only">
                Square {challenge.index + 1}. {status}. {selected === challenge.index ? "Selected." : ""} {text}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-lg">Hard to use the squares? Open the big list. Every challenge is written out in large type.</p>
    </section>
  );
}
