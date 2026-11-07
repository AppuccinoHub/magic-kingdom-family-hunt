"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DayExplore, NightFireworks } from "@/components/art";
import { AdvisorLine, DeviceNotice, ParkNotice, UnofficialNotice } from "@/components/notices";
import { PersonFields } from "@/components/person-fields";
import { Frame } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listPhoneHunts, phoneCreate, writeActive } from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";

type Mode = "home" | "create" | "ready";

export function WelcomeScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("home");
  const [phoneHunts, setPhoneHunts] = useState<HuntState[]>([]);
  const [familyName, setFamilyName] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("star");
  const [advisorName, setAdvisorName] = useState("");
  const [ready, setReady] = useState<HuntState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [scene, setScene] = useState<"day" | "night">("day");

  useEffect(() => {
    listPhoneHunts()
      .then(setPhoneHunts)
      .catch(() => setPhoneHunts([]));
  }, []);

  async function create() {
    setError("");
    setBusy(true);
    try {
      if (!familyName.trim()) throw new Error("Type a family name to start.");
      const state = await phoneCreate({ familyName, nickname, avatar, advisorName });
      writeActive({ mode: "phone", id: state.hunt.id });
      setReady(state);
      setMode("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The hunt could not be created.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Frame>
      <div className={`overflow-hidden rounded-[2rem] ${scene === "day" ? "bg-[#e7f6ff]" : "bg-night"}`}>
        {scene === "day" ? <DayExplore className="h-auto w-full" /> : <NightFireworks className="h-auto w-full" />}
        <div className="px-4 pb-5">
          <h1 className={`font-display text-5xl leading-none ${scene === "day" ? "text-ink" : "text-white"}`}>Our family adventure</h1>
          <p className={`mt-2 text-2xl font-bold leading-snug ${scene === "day" ? "text-[#8C6418]" : "text-[#ffe08a]"}`}>Magic Kingdom family bingo</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2" role="group" aria-label="Picture">
        <button
          type="button"
          className={`min-h-11 flex-1 rounded-full border-2 border-ink px-3 text-base font-bold ${scene === "day" ? "bg-butter" : "bg-paper"}`}
          aria-pressed={scene === "day"}
          onClick={() => setScene("day")}
        >
          Day scene
        </button>
        <button
          type="button"
          className={`min-h-11 flex-1 rounded-full border-2 border-ink px-3 text-base font-bold ${scene === "night" ? "bg-butter" : "bg-paper"}`}
          aria-pressed={scene === "night"}
          onClick={() => setScene("night")}
        >
          Night fireworks
        </button>
      </div>
      {mode === "home" ? (
        <div className="mt-4 grid gap-4">
          <Button size="tall" onClick={() => setMode("create")}>
            Start your hunt
          </Button>
          <p className="text-2xl leading-snug">Play together on one phone. Big letters. No timer. No sign-up.</p>
          <p className="text-lg">For ages 7 to 87. Open Settings for larger letters or less motion.</p>
          <DeviceNotice />
          <section className="grid gap-3" aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-2xl font-bold">
              How to play
            </h2>
            {[
              "Start a hunt on this phone.",
              "Pass this phone to the person playing.",
              "Read a challenge in big letters.",
              "Do it together at the park, then stamp it. Five in a line is a bingo.",
            ].map((step, index) => (
              <p key={step} className={`rounded-3xl p-4 text-xl font-bold leading-snug ${["bg-peach", "bg-butter", "bg-mint", "bg-sky"][index]}`}>
                {index + 1}. {step}
              </p>
            ))}
          </section>
          <p className="rounded-3xl bg-lilac p-4 text-xl font-bold">One card on this phone. Whoever holds it can stamp. Find all 25 for a big celebration.</p>
          {phoneHunts.map((hunt) => (
            <Button
              key={hunt.hunt.id}
              size="tall"
              onClick={() => {
                writeActive({ mode: "phone", id: hunt.hunt.id });
                router.push("/hunt");
              }}
            >
              Open {hunt.hunt.familyName}
            </Button>
          ))}
          <ParkNotice />
          <UnofficialNotice />
          <AdvisorLine name="" />
        </div>
      ) : null}

      {mode === "create" ? (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void create();
          }}
        >
          <h2 className="text-3xl font-bold">New family hunt</h2>
          <DeviceNotice />
          <div className="grid gap-2">
            <label htmlFor="family-name" className="text-xl font-bold">
              Family name
            </label>
            <p id="family-hint" className="text-lg">
              For example, The Patel family. This is printed on your passport.
            </p>
            <Input
              id="family-name"
              value={familyName}
              onChange={(event) => setFamilyName(event.target.value)}
              maxLength={60}
              aria-describedby="family-hint"
              required
            />
          </div>
          <PersonFields nickname={nickname} onNickname={setNickname} avatar={avatar} onAvatar={setAvatar} />
          <div className="grid gap-2">
            <label htmlFor="advisor-name" className="text-xl font-bold">
              Travel advisor name
            </label>
            <p id="advisor-hint" className="text-lg">
              Optional. Shown on the passport and certificate. Leave blank if you prefer. Do not type a phone number or email.
            </p>
            <Input
              id="advisor-name"
              value={advisorName}
              onChange={(event) => setAdvisorName(event.target.value)}
              maxLength={80}
              aria-describedby="advisor-hint"
              autoComplete="off"
            />
          </div>
          {error ? (
            <p role="alert" className="text-xl font-bold text-coral">
              {error}
            </p>
          ) : null}
          <Button size="tall" type="submit" disabled={busy || !familyName.trim()}>
            {busy ? "Saving…" : "Create our hunt"}
          </Button>
          <Button variant="quiet" onClick={() => setMode("home")}>
            Back
          </Button>
        </form>
      ) : null}

      {mode === "ready" && ready ? (
        <div className="mt-5 grid gap-4">
          <h2 className="text-3xl font-bold">{ready.hunt.familyName} is ready</h2>
          <p className="rounded-2xl border-2 border-gold bg-gold-soft p-4 text-xl font-bold" role="status">
            Saved in this browser. Pass this phone to play together. Another phone will not see these stamps or photos.
          </p>
          <Button asChild size="tall">
            <Link href="/hunt/">Open the bingo card</Link>
          </Button>
        </div>
      ) : null}
    </Frame>
  );
}
