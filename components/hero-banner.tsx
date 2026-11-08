import { ART, artSrc } from "@/lib/illustrations";

export function HeroBanner({
  scene,
  title,
  subtitle,
  titleId,
}: {
  scene: "day" | "night";
  title: string;
  subtitle: string;
  titleId?: string;
}) {
  const night = scene === "night";
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] shadow-md">
      <img
        src={artSrc(night ? ART.bannerNight : ART.bannerDay)}
        alt=""
        className="block h-auto w-full"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
        <div className="max-w-full text-center">
          <h1 id={titleId} tabIndex={-1} className="text-2xl font-extrabold leading-tight text-white outline-none [text-shadow:0_2px_10px_rgba(18,8,40,0.9)]">
            {title}
          </h1>
          <p className="mt-1 text-base font-bold leading-tight text-[#ffe08a] [text-shadow:0_2px_8px_rgba(18,8,40,0.9)]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
