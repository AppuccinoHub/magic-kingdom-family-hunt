import { CHALLENGES } from "@/lib/challenges";
import { lineIndexes } from "@/lib/bingo";
import { cardTint } from "@/lib/card-style";
import type { HuntState } from "@/lib/types";
import { challengeImage } from "@/lib/illustrations";

export function BoardView({ state, onOpen }: { state: HuntState; onOpen: (index: number) => void }) {
  const done = state.challenges.map((challenge) => challenge.done);
  const lines = lineIndexes(done);

  return (
    <section className="grid gap-3" aria-labelledby="board-heading">
      <h2 id="board-heading" tabIndex={-1} className="text-xl font-bold leading-tight outline-none">
        Bingo card
      </h2>
      <p className="text-xl leading-snug">Tap a square. Five in a line is a bingo.</p>
      <div role="group" aria-label="Bingo card, 5 by 5" className="grid min-w-0 grid-cols-5 gap-1">
        {state.challenges.map((challenge) => {
          const text = CHALLENGES[challenge.index].text;
          const inLine = lines.has(challenge.index);
          const status = inLine ? "Line" : challenge.done ? "Done" : "Open";
          return (
            <button
              key={challenge.index}
              type="button"
              onClick={() => onOpen(challenge.index)}
              className={`bingo-cell flex min-h-14 min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 px-0.5 py-1 text-center font-bold leading-none ${challenge.done ? "border-moss bg-mint" : "border-ink bg-paper"} ${cardTint(challenge.index)}`}
            >
              <img src={challengeImage(CHALLENGES[challenge.index].icon)} alt="" className="h-8 w-8 max-w-full rounded-full object-cover" />
              <span aria-hidden="true" className="bingo-status">
                {status}
              </span>
              <span className="sr-only">
                Square {challenge.index + 1}. {status}. {text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
