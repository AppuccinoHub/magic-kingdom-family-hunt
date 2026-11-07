import { AvatarMark } from "@/components/avatar-mark";
import { AVATARS } from "@/lib/avatars";

export function PersonFields({
  nickname,
  onNickname,
  avatar,
  onAvatar,
  nicknameLabel = "Your name on the stamps",
}: {
  nickname: string;
  onNickname: (value: string) => void;
  avatar: string;
  onAvatar: (value: string) => void;
  nicknameLabel?: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="nickname" className="text-xl font-bold">
          {nicknameLabel}
        </label>
        <p id="nickname-hint" className="text-lg">
          Optional. For example, Grandma. If you leave it blank, stamps say Our family.
        </p>
        <input
          id="nickname"
          className="min-h-16 w-full rounded-2xl border-2 border-ink bg-paper px-4 text-2xl"
          value={nickname}
          onChange={(event) => onNickname(event.target.value)}
          maxLength={24}
          autoComplete="nickname"
          aria-describedby="nickname-hint"
        />
      </div>
      <fieldset className="grid gap-3">
        <legend className="text-xl font-bold">Pick a picture</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AVATARS.map((item) => (
            <label
              key={item.id}
              className={`flex min-h-16 cursor-pointer items-center gap-2 rounded-2xl border-2 px-3 text-lg font-bold ${avatar === item.id ? "border-coral bg-coral-soft" : "border-ink bg-paper"}`}
            >
              <input
                type="radio"
                name="avatar"
                value={item.id}
                checked={avatar === item.id}
                onChange={() => onAvatar(item.id)}
                className="size-6"
              />
              <AvatarMark id={item.id} className="h-9 w-9 shrink-0" />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
