"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AdventureParade } from "@/components/art";
import { AdvisorLine, ParkNotice, UnofficialNotice } from "@/components/notices";
import { PersonFields } from "@/components/person-fields";
import { Frame } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidCode } from "@/lib/codes";
import { readJson } from "@/lib/load-hunt";
import { listPhoneHunts, phoneCreate, writeActive } from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";

type Mode = "home" | "create" | "join" | "phone" | "ready";

export function WelcomeScreen() {
  const [mode, setMode] = useState<Mode>("home");
  const [serverUp, setServerUp] = useState<boolean | null>(null);
  const [existing, setExisting] = useState<HuntState | null>(null);
  const [phoneHunts, setPhoneHunts] = useState<HuntState[]>([]);
  const [familyName, setFamilyName] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("star");
  const [advisorName, setAdvisorName] = useState("");
  const [code, setCode] = useState("");
  const [ready, setReady] = useState<HuntState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then((res) => setServerUp(res.ok))
      .catch(() => setServerUp(false));
    fetch("/api/hunt", { cache: "no-store" })
      .then(async (res) => {
        if (res.ok) setExisting(await res.json());
      })
      .catch(() => setServerUp(false));
    listPhoneHunts()
      .then(setPhoneHunts)
      .catch(() => setPhoneHunts([]));
  }, []);

  async function create(phoneOnly: boolean) {
    setError("");
    setBusy(true);
    try {
      if (!familyName.trim()) throw new Error("Type a family name to start.");
      if (phoneOnly) {
        const state = await phoneCreate({ familyName, nickname, avatar, advisorName });
        writeActive({ mode: "phone", id: state.hunt.id });
        setReady(state);
        setMode("ready");
        return;
      }
      const res = await fetch("/api/hunts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyName, nickname, avatar, advisorName }),
      });
      const state = await readJson<HuntState>(res);
      writeActive({ mode: "server" });
      setReady(state);
      setMode("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The hunt could not be created.");
    } finally {
      setBusy(false);
    }
  }

  async function join(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/hunts/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nickname, avatar }),
      });
      await readJson<HuntState>(res);
      writeActive({ mode: "server" });
      window.location.href = "/hunt";
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code did not work.");
    } finally {
      setBusy(false);
    }
  }

  async function copyCode() {
    if (!ready?.hunt.code) return;
    try {
      await navigator.clipboard.writeText(ready.hunt.code);
      setCopied("Copied. You can paste it in a message to your family.");
    } catch {
      setCopied("Copy did not work. Select the code and copy it yourself.");
    }
  }

  return (
    <Frame>
      <div className="overflow-hidden rounded-[2rem] bg-night">
        <AdventureParade className="h-auto w-full" />
        <div className="px-4 pb-5">
          <h1 className="font-display text-5xl leading-none text-white">Our family adventure</h1>
          <p className="mt-2 text-2xl font-bold leading-snug text-[#ffe08a]">Magic Kingdom family bingo</p>
        </div>
      </div>
      <p className="mt-4 text-2xl leading-snug">Play together. Big letters. No timer. No sign-up.</p>
      <p className="mt-2 text-lg">For ages 7 to 87. Pinch to zoom, or use Text size at the top.</p>

      {serverUp === false ? (
        <p role="status" className="mt-4 rounded-2xl border-2 border-gold bg-gold-soft p-4 text-lg font-bold">
          The shared hunt server is not reachable. You can still play on this phone only. Another phone cannot join that hunt.
        </p>
      ) : null}

      {mode === "home" ? (
        <div className="mt-5 grid gap-4">
          <section className="grid gap-3" aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-2xl font-bold">
              How to play
            </h2>
            {[
              "Start a hunt, or join with your family code.",
              "Read a challenge in big letters.",
              "Do it together at the park.",
              "Stamp it. Five in a line is a bingo.",
            ].map((step, index) => (
              <p key={step} className={`rounded-3xl p-4 text-xl font-bold leading-snug ${["bg-peach", "bg-butter", "bg-mint", "bg-sky"][index]}`}>
                {index + 1}. {step}
              </p>
            ))}
          </section>
          <p className="rounded-3xl bg-lilac p-4 text-xl font-bold">One shared card. Everybody’s stamp counts. Find all 25 for a big celebration.</p>
          {existing ? (
            <Button asChild size="tall">
              <Link href="/hunt" onClick={() => writeActive({ mode: "server" })}>
                Open {existing.hunt.familyName}
              </Link>
            </Button>
          ) : null}
          {phoneHunts.map((hunt) => (
            <Button
              key={hunt.hunt.id}
              variant="secondary"
              onClick={() => {
                writeActive({ mode: "phone", id: hunt.hunt.id });
                window.location.href = "/hunt";
              }}
            >
              Open {hunt.hunt.familyName} on this phone only
            </Button>
          ))}
          <Button size="tall" onClick={() => setMode("create")} disabled={serverUp === false}>
            Start a new family hunt
          </Button>
          <Button size="tall" variant="secondary" onClick={() => setMode("join")} disabled={serverUp === false}>
            Join with a family code
          </Button>
          <Button variant="quiet" onClick={() => setMode("phone")}>
            Use this phone only
          </Button>
          <ParkNotice />
          <UnofficialNotice />
          <AdvisorLine name="" />
        </div>
      ) : null}

      {mode === "create" || mode === "phone" ? (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void create(mode === "phone");
          }}
        >
          <h2 className="text-3xl font-bold">{mode === "phone" ? "On this phone only" : "New family hunt"}</h2>
          {mode === "phone" ? (
            <p className="text-xl">This hunt is saved on this phone. It will not show up on another phone. There is no family code.</p>
          ) : (
            <p className="text-xl">You will get a private code to share with your family. No email or phone number is asked.</p>
          )}
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

      {mode === "join" ? (
        <form className="mt-5 grid gap-4" onSubmit={(event) => void join(event)}>
          <h2 className="text-3xl font-bold">Join your family</h2>
          <div className="grid gap-2">
            <label htmlFor="family-code" className="text-xl font-bold">
              Family code
            </label>
            <p id="code-hint" className="text-lg">
              The code is 12 letters and numbers, like ABCD-EFGH-JKLM. It does not use 0, 1, I, or O.
            </p>
            <Input
              id="family-code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              aria-describedby="code-hint"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="tracking-wide"
            />
          </div>
          <PersonFields nickname={nickname} onNickname={setNickname} avatar={avatar} onAvatar={setAvatar} nicknameLabel="Your name" />
          {error ? (
            <p role="alert" className="text-xl font-bold text-coral">
              {error}
            </p>
          ) : null}
          <Button size="tall" type="submit" disabled={busy || !isValidCode(code)}>
            {busy ? "Checking the code…" : "Join the hunt"}
          </Button>
          <Button variant="quiet" onClick={() => setMode("home")}>
            Back
          </Button>
        </form>
      ) : null}

      {mode === "ready" && ready ? (
        <div className="mt-5 grid gap-4">
          <h2 className="text-3xl font-bold">{ready.hunt.familyName} is ready</h2>
          {ready.phoneOnly ? (
            <p className="rounded-2xl border-2 border-gold bg-gold-soft p-4 text-xl font-bold" role="status">
              Saved on this phone only. Other phones cannot join this hunt.
            </p>
          ) : (
            <>
              <p className="text-xl">Share this code with your family. Anyone with it can join and can see notes and photos. Keep it private.</p>
              <p data-testid="family-code" className="rounded-3xl border-4 border-ink bg-cream px-3 py-5 text-center text-4xl font-bold tracking-wide">
                {ready.hunt.code}
              </p>
              <Button variant="secondary" onClick={() => void copyCode()}>
                Copy the code
              </Button>
              {copied ? (
                <p role="status" className="text-lg font-bold">
                  {copied}
                </p>
              ) : null}
            </>
          )}
          <Button asChild size="tall">
            <Link href="/hunt">Open the bingo card</Link>
          </Button>
        </div>
      ) : null}
    </Frame>
  );
}
