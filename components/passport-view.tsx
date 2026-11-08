"use client";

import { useState } from "react";
import Link from "next/link";
import { AvatarMark } from "@/components/avatar-mark";
import { CollectibleStamp } from "@/components/art";
import { CHALLENGES } from "@/lib/challenges";
import { namesMatch, formatWhen } from "@/lib/utils";
import type { HuntState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersonFields } from "@/components/person-fields";

export function PassportView({
  state,
  who,
  onWho,
  onOpen,
  photoSrc,
  onSaveNames,
  onAddMember,
  onReset,
  onDelete,
  onLeave,
  onReplay,
  offline,
  busy,
}: {
  state: HuntState;
  who: string;
  onWho: (id: string) => void;
  onOpen: (index: number) => void;
  photoSrc: (index: number) => string | undefined;
  onSaveNames: (familyName: string, advisorName: string) => Promise<void>;
  onAddMember: (nickname: string, avatar: string) => Promise<void>;
  onReset: (familyName: string) => Promise<void>;
  onDelete: (familyName: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onReplay: () => void;
  offline: boolean;
  busy: boolean;
}) {
  const [openSettings, setOpenSettings] = useState(false);
  const [familyName, setFamilyName] = useState(state.hunt.familyName);
  const [advisorName, setAdvisorName] = useState(state.hunt.advisorName);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("heart");
  const [eraseName, setEraseName] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [message, setMessage] = useState("");
  const stamped = state.challenges.filter((challenge) => challenge.done);

  return (
    <section className="grid gap-4" aria-labelledby="passport-heading">
      <h2 id="passport-heading" className="text-xl font-bold leading-tight">
        Adventure passport
      </h2>
      <p className="text-xl leading-snug">This passport stays on this phone. Whoever holds the phone adds the stamp. Names show who held it. They are not scores.</p>
      <p className="text-lg font-bold">
        {stamped.length} of 25 stamps. {state.bingoLineCount} of 12 bingo lines.
      </p>
      {stamped.length === 0 ? (
        <p className="rounded-3xl border-2 border-dashed border-gold p-4 text-2xl font-bold">Your passport is empty. Stamp a challenge and it will show up here.</p>
      ) : (
        <ol className="grid gap-4">
          {stamped.map((challenge) => {
            const card = CHALLENGES[challenge.index];
            const src = photoSrc(challenge.index);
            return (
              <li key={challenge.index} className="min-w-0 rounded-3xl border-4 border-ink bg-butter p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <CollectibleStamp name={card.icon} found className="h-32 w-28 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg font-bold">
                      Stamped{challenge.stampedByName ? ` by ${challenge.stampedByName}` : ""}
                      {challenge.stampedAt ? ` · ${formatWhen(challenge.stampedAt)}` : ""}
                    </p>
                    <h3 className="mt-1 break-words text-2xl font-bold leading-tight">{card.text}</h3>
                    {challenge.note ? <p className="mt-2 text-xl">Note: {challenge.note}</p> : null}
                  </div>
                </div>
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={`Photo for challenge ${challenge.index + 1}`} className="mt-3 max-h-64 w-full rounded-2xl border-2 border-ink object-contain" />
                ) : null}
                <Button className="mt-3" variant="secondary" onClick={() => onOpen(challenge.index)}>
                  Open this memory
                </Button>
              </li>
            );
          })}
        </ol>
      )}
      {state.stampCount === 25 ? (
        <Button data-testid="replay-celebration" onClick={onReplay}>
          Play the celebration again
        </Button>
      ) : (
        <p className="rounded-3xl bg-butter p-4 text-xl font-bold">Find all 25 for a big celebration.</p>
      )}
      <Button asChild>
        <Link href="/certificate">Make a souvenir certificate</Link>
      </Button>
      <Button variant="secondary" onClick={() => setOpenSettings((open) => !open)}>
        {openSettings ? "Hide family settings" : "Family settings"}
      </Button>
      {openSettings ? (
        <div className="grid gap-4 rounded-3xl border-2 border-ink p-4">
          <fieldset className="grid gap-2">
            <legend className="text-xl font-bold">Who has the phone?</legend>
            {state.members.map((member) => (
              <label key={member.id} className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-3 text-xl font-bold ${who === member.id ? "border-coral bg-coral-soft" : "border-ink bg-paper"}`}>
                <input type="radio" name="who" value={member.id} checked={who === member.id} onChange={() => onWho(member.id)} className="size-6" />
                <AvatarMark id={member.avatar} className="h-8 w-8 shrink-0" />
                <span>
                  {member.nickname} · {member.avatarLabel}
                </span>
              </label>
            ))}
          </fieldset>
          <p className="text-xl font-bold">This hunt stays in this browser. Pass the phone. There is no code that opens it on another phone.</p>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void onSaveNames(familyName, advisorName).then(() => setMessage("Names saved."));
            }}
          >
            <label htmlFor="edit-family" className="text-xl font-bold">
              Family name
            </label>
            <Input id="edit-family" value={familyName} onChange={(event) => setFamilyName(event.target.value)} maxLength={60} />
            <label htmlFor="edit-advisor" className="text-xl font-bold">
              Travel advisor name
            </label>
            <p className="text-lg">Optional. Leave blank to show “your travel advisor.” Do not type a phone number or email.</p>
            <Input id="edit-advisor" value={advisorName} onChange={(event) => setAdvisorName(event.target.value)} maxLength={80} autoComplete="off" />
            <Button type="submit" variant="secondary" disabled={offline || busy || !familyName.trim()}>
              Save names
            </Button>
          </form>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void onAddMember(nickname, avatar).then(() => {
                setNickname("");
                setMessage("Person added.");
              });
            }}
          >
            <h3 className="text-2xl font-bold">Add a person on this phone</h3>
            <PersonFields nickname={nickname} onNickname={setNickname} avatar={avatar} onAvatar={setAvatar} nicknameLabel="Name" />
            <Button type="submit" variant="secondary" disabled={offline || busy}>
              Add this person
            </Button>
          </form>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void onReset(eraseName);
            }}
          >
            <h3 className="text-2xl font-bold">Erase every stamp?</h3>
            <p className="text-lg">Notes and photos on this hunt will be removed too. This cannot be undone.</p>
            <label htmlFor="erase-name" className="text-xl font-bold">
              Type the family name to unlock erase: {state.hunt.familyName}
            </label>
            <Input id="erase-name" value={eraseName} onChange={(event) => setEraseName(event.target.value)} autoComplete="off" />
            <Button type="submit" variant="secondary" disabled={offline || busy || !namesMatch(eraseName, state.hunt.familyName)}>
              Erase stamps
            </Button>
          </form>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void onDelete(deleteName);
            }}
          >
            <h3 className="text-2xl font-bold">Delete this whole hunt?</h3>
            <p className="text-lg">This removes the hunt from this browser only. It cannot be undone.</p>
            <label htmlFor="delete-name" className="text-xl font-bold">
              Type the family name to confirm
            </label>
            <Input id="delete-name" value={deleteName} onChange={(event) => setDeleteName(event.target.value)} autoComplete="off" />
            <Button type="submit" variant="secondary" disabled={offline || busy || !namesMatch(deleteName, state.hunt.familyName)}>
              Delete the hunt
            </Button>
          </form>
          <Button
            variant="quiet"
            onClick={() => {
              const ok = window.confirm("Close this hunt? It stays saved in this browser. You can open it again from the start page.");
              if (ok) void onLeave();
            }}
          >
            Close this hunt
          </Button>
          {message ? (
            <p role="status" className="text-lg font-bold">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
