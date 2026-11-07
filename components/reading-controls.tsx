"use client";

import { useEffect, useState } from "react";

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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby="text-size-label">
        <p id="text-size-label" className="font-bold text-white">
          Text size
        </p>
        <button
          type="button"
          className="min-h-14 max-w-full rounded-2xl border-2 border-ink bg-paper px-3 text-lg font-bold whitespace-normal text-ink"
          onClick={() => apply(STEPS[Math.max(0, index - 1)], reduce)}
          disabled={index <= 0}
          id="text-smaller"
          aria-label="Smaller text"
        >
          Smaller
        </button>
        <p aria-live="polite" className="min-w-16 font-bold text-white">
          {LABELS[step]}
        </p>
        <button
          type="button"
          className="min-h-14 max-w-full rounded-2xl border-2 border-ink bg-paper px-3 text-lg font-bold whitespace-normal text-ink"
          onClick={() => apply(STEPS[Math.min(STEPS.length - 1, index + 1)], reduce)}
          disabled={index >= STEPS.length - 1}
          id="text-bigger"
          aria-label="Bigger text"
        >
          Bigger
        </button>
      </div>
        <button
        type="button"
        className={`min-h-14 max-w-full rounded-2xl border-2 border-ink px-3 text-lg font-bold whitespace-normal text-ink ${motionOn ? "bg-butter" : "bg-paper"}`}
        aria-label={motionOn ? "Less motion on" : "Less motion off"}
        aria-pressed={motionOn}
        onClick={() => apply(step, systemReduce ? true : !reduce)}
      >
        {motionOn ? "Motion off" : "Motion on"}
      </button>
    </div>
  );
}
