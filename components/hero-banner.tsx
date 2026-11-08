import { ART, artSrc } from "@/lib/illustrations";

export function HeroBanner({
  scene,
  title,
  subtitle,
}: {
  scene: "day" | "night";
  title: string;
  subtitle: string;
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
          <h1 className="text-[1.85rem] font-extrabold leading-[0.95] text-white [text-shadow:0_2px_10px_rgba(18,8,40,0.9)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-xl font-extrabold leading-tight text-[#ffe08a] [text-shadow:0_2px_8px_rgba(18,8,40,0.9)]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
