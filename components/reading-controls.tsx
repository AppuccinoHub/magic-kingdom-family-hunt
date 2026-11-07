"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const STEPS = ["lg", "xl", "xxl"] as const;
type Step = (typeof STEPS)[number];
const LABELS: Record<Step, string> = { lg: "Large", xl: "Larger", xxl: "Largest" };

function currentStep(): Step {
  const value = document.documentElement.dataset.text;
  return value === "xl" || value === "xxl" ? value : "lg";
}

export function ReadingControls() {
  const [step, setStep] = useState<Step>("lg");
  const [reduce, setReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);

  useEffect(() => {
    setStep(currentStep());
    setReduce(document.documentElement.dataset.motion === "reduce");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSystemReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  function apply(nextStep: Step, nextReduce: boolean) {
    document.documentElement.dataset.text = nextStep;
    if (nextReduce) document.documentElement.dataset.motion = "reduce";
    else delete document.documentElement.dataset.motion;
    localStorage.setItem("mk-text", nextStep);
    localStorage.setItem("mk-motion", nextReduce ? "reduce" : "ok");
    setStep(nextStep);
    setReduce(nextReduce);
    window.dispatchEvent(new Event("mk-reading"));
  }

  const index = STEPS.indexOf(step);
  const motionOn = reduce || systemReduce;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="min-h-11 rounded-full border-2 border-ink bg-paper px-4 text-base font-bold text-ink">
          Settings
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Letters start large. Change them here if you want. Less motion keeps the fireworks still.</DialogDescription>
        <div className="mt-4 grid gap-3" role="group" aria-labelledby="text-size-label">
          <p id="text-size-label" className="text-xl font-bold">
            Text size
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="min-h-14 rounded-2xl border-2 border-ink bg-paper px-3 text-lg font-bold text-ink"
              onClick={() => apply(STEPS[Math.max(0, index - 1)], reduce)}
              disabled={index <= 0}
              id="text-smaller"
              aria-label="Smaller text"
            >
              Smaller
            </button>
            <p aria-live="polite" className="min-w-16 text-lg font-bold">
              {LABELS[step]}
            </p>
            <button
              type="button"
              className="min-h-14 rounded-2xl border-2 border-ink bg-paper px-3 text-lg font-bold text-ink"
              onClick={() => apply(STEPS[Math.min(STEPS.length - 1, index + 1)], reduce)}
              disabled={index >= STEPS.length - 1}
              id="text-bigger"
              aria-label="Bigger text"
            >
              Bigger
            </button>
          </div>
        </div>
        <button
          type="button"
          className={`mt-4 min-h-14 rounded-2xl border-2 border-ink px-3 text-lg font-bold text-ink ${motionOn ? "bg-butter" : "bg-paper"}`}
          aria-pressed={motionOn}
          onClick={() => apply(step, systemReduce ? true : !reduce)}
        >
          {motionOn ? "Less motion is on" : "Turn on less motion"}
        </button>
        {systemReduce ? <p className="mt-3 text-lg">This phone asked for less motion, so the fireworks stay still.</p> : null}
      </DialogContent>
    </Dialog>
  );
}
