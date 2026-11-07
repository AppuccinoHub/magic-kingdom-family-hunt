"use client";

import { CollectibleStamp, FireworkSky } from "@/components/art";
import { ConfettiBurst } from "@/components/confetti";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

export function FoundEverything({
  open,
  onClose,
  onMemories,
}: {
  open: boolean;
  onClose: () => void;
  onMemories: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="relative overflow-hidden" data-testid="found-everything">
        <ConfettiBurst play={open} />
        <FireworkSky motion={!reduce} className="h-auto w-full" />
        <div className="mt-3 flex flex-wrap justify-center gap-2" data-testid="static-stars" aria-hidden="true">
          <CollectibleStamp name="elephant" found className="h-28 w-24" />
          <CollectibleStamp name="cart" found className="h-28 w-24" />
          <CollectibleStamp name="cup" found className="h-28 w-24" />
        </div>
        <DialogTitle className="mt-3 break-words text-center">You found everything!</DialogTitle>
        <DialogDescription className="text-center text-2xl">
          25 of 25 stamps. Your whole family filled the card.
        </DialogDescription>
        <p className="mt-3 text-center text-xl">There is no clock and no score. This is your souvenir.</p>
        <div className="relative z-10 mt-5 grid gap-3">
          <Button asChild size="tall">
            <Link href="/certificate">See the family certificate</Link>
          </Button>
          <Button size="tall" variant="secondary" onClick={onMemories}>
            Back to memories
          </Button>
          <Button variant="quiet" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
