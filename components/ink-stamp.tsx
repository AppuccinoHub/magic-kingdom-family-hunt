"use client";

import { useId } from "react";

const INKS = ["#7c2430", "#1d3f72", "#1c4d3a", "#6d3d14"];

/** Inked passport mark. Earned stamps use real ink; unearned stamps stay a faint outline. */
export function InkStamp({
  icon,
  label,
  earned,
  index,
  className,
}: {
  icon: string;
  label: string;
  earned: boolean;
  index: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const ink = INKS[index % INKS.length];
  const color = earned ? ink : "#8d847b";
  const turn = earned ? ((index * 11) % 9) - 4 : 0;
  const caption = label.toUpperCase();
  const captionSize = caption.length > 14 ? 7.5 : caption.length > 9 ? 9 : 11;

  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      style={{ transform: `rotate(${turn}deg)` }}
      role="img"
      aria-label={earned ? `Passport stamp, ${label}` : `Empty passport stamp, ${label}`}
    >
      <defs>
        <filter id={`${uid}-ink`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={index + 4} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={earned ? 2.1 : 0.6} />
        </filter>
        <path id={`${uid}-arc`} d="M28 82a52 52 0 0 1 104 0" />
      </defs>
      <g filter={`url(#${uid}-ink)`} fill="none" stroke={color} opacity={earned ? 0.92 : 0.7}>
        <circle cx="80" cy="80" r="70" strokeWidth="2.4" />
        <circle cx="80" cy="80" r="63" strokeWidth="1.1" strokeDasharray={earned ? undefined : "2.5 2.2"} />
        {Array.from({ length: 28 }, (_, tick) => {
          const angle = (tick / 28) * Math.PI * 2;
          const inner = tick % 2 === 0 ? 66 : 67.2;
          return (
            <line
              key={tick}
              x1={80 + Math.cos(angle) * inner}
              y1={80 + Math.sin(angle) * inner}
              x2={80 + Math.cos(angle) * 70}
              y2={80 + Math.sin(angle) * 70}
              strokeWidth="0.8"
            />
          );
        })}
        <g transform="translate(80 74) scale(1.28) translate(-80 -74)">
          <StampMark icon={icon} />
        </g>
        <text fill={color} stroke="none" fontSize="8" letterSpacing="2.2" fontFamily="Georgia, serif">
          <textPath href={`#${uid}-arc`} startOffset="18%">
            FAMILY HUNT
          </textPath>
        </text>
        <text
          x="80"
          y={earned ? 118 : 112}
          textAnchor="middle"
          fill={color}
          stroke="none"
          fontSize={captionSize}
          fontFamily="Georgia, serif"
          letterSpacing="0.6"
        >
          {earned ? caption : "NOT YET"}
        </text>
      </g>
    </svg>
  );
}

function StampMark({ icon }: { icon: string }) {
  const common = { fill: "none", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "castle":
      return <path {...common} d="M58 78V62h6v-8h6v8h8v-8h6v8h6v16H58zm8 0v-6h8v6" />;
    case "lamp":
      return <path {...common} d="M80 54v8M68 70h24l-4 16H72zM74 86h12" />;
    case "vehicle":
      return <path {...common} d="M58 78h36l-4-12H66zm6 0v6m20-6v6M66 72h10" />;
    case "paw":
      return (
        <g {...common}>
          <ellipse cx="80" cy="78" rx="8" ry="6" />
          <circle cx="70" cy="66" r="2.2" />
          <circle cx="78" cy="62" r="2.2" />
          <circle cx="86" cy="66" r="2.2" />
        </g>
      );
    case "baseball":
      return <path {...common} d="M80 60a16 16 0 1 0 0 32 16 16 0 0 0 0-32zM72 66c4 6 4 14 0 20M88 66c-4 6-4 14 0 20" />;
    case "flag":
      return <path {...common} d="M68 92V58h22l-4 8 4 8H68" />;
    case "peanut":
      return <path {...common} d="M74 60c8 0 10 6 8 10 6 2 6 8 0 10-2 8-12 8-14 0-6-2-8-8-2-10 0-6 4-10 8-10z" />;
    case "sniff":
      return <path {...common} d="M64 84h32V68H64zm8-16c0-6 16-6 16 0" />;
    case "antlers":
      return <path {...common} d="M72 90V70M88 90V70M72 70c-8-2-10-12-4-16M88 70c8-2 10-12 4-16" />;
    case "elephant":
      return <path {...common} d="M62 80c2-12 12-16 22-14 6 1 10 6 12 10 4 0 8 4 6 8H62zm28-6c4 6 6 12 2 16" />;
    case "lizard":
      return <path {...common} d="M60 78c8-8 20-8 28-2 4 2 8 0 12-4M64 82c6 6 18 6 24 0" />;
    case "bat":
      return <path {...common} d="M80 84c-4-12-16-14-24-6 6 2 8 8 4 12 8 2 14 8 20 8 6 0 12-6 20-8-4-4-2-10 4-12-8-8-20-6-24 6z" />;
    case "search":
      return <path {...common} d="M74 66a10 10 0 1 0 0.1 0M82 78l8 8" />;
    case "river":
      return <path {...common} d="M58 70c6 4 8 4 14 0s8-4 14 0 8 4 14 0M58 80c6 4 8 4 14 0s8-4 14 0 8 4 14 0" />;
    case "question":
      return <path {...common} d="M74 66c0-6 12-6 12 2 0 4-6 4-6 8M80 86h.1" />;
    case "spark":
      return <path {...common} d="M80 58v24M68 70h24M72 62l16 16M88 62L72 78" />;
    case "fountain":
      return <path {...common} d="M64 90h32M70 90V78h20v12M80 78V66M72 70c4-6 12-6 16 0" />;
    case "bag":
      return <path {...common} d="M68 70h24l-2 20H70zm6 0v-6a6 6 0 0 1 12 0v6" />;
    case "letter":
      return <path {...common} d="M62 66h36v22H62zm0 0l18 12 18-12" />;
    case "door":
      return <path {...common} d="M66 92V60h28v32M84 76h2" />;
    case "camel":
      return <path {...common} d="M60 84c8-16 18-18 28-8 6-8 14-6 16 0v10H60z" />;
    case "tiles":
      return <path {...common} d="M64 64h10v10H64zm12 0h10v10H76zm12 0h10v10H88zM64 76h10v10H64zm12 0h10v10H76z" />;
    case "cart":
      return <path {...common} d="M60 84h34l4-14H66M64 84l-4 6h32M70 90a2 2 0 1 0 .1 0M86 90a2 2 0 1 0 .1 0" />;
    case "cup":
      return <path {...common} d="M70 68h16l-2 16H72zm4-8c0-4 8-4 8 0M86 74h6a6 6 0 0 1 0 8h-4" />;
    case "badge":
      return <path {...common} d="M80 58l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" />;
    default:
      return <path {...common} d="M80 60l3 8h8l-6 5 2 8-7-5-7 5 2-8-6-5h8z" />;
  }
}
