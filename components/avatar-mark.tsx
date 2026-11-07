const ink = "#14233C";
const gold = "#C4922A";
const cream = "#F6E7C8";
const coral = "#C44536";
const teal = "#1F6F62";

/** Small travel-poster marks for names. Not emoji, and not a character. */
export function AvatarMark({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <Mark id={id} />
    </svg>
  );
}

function Mark({ id }: { id: string }) {
  switch (id) {
    case "crown":
      return (
        <g>
          <path d="M8 32 12 16l8 8 4-12 4 12 8-8 4 16z" fill={gold} />
          <path d="M10 32h28v4H10z" fill="#8C6418" />
          <circle cx="16" cy="30" r="1.4" fill={coral} />
          <circle cx="24" cy="30" r="1.4" fill={teal} />
          <circle cx="32" cy="30" r="1.4" fill={coral} />
          <path d="M14 20h2M24 10v3M32 20h2" stroke={cream} strokeWidth="1" />
        </g>
      );
    case "star":
      return (
        <g>
          <path d="M24 6 28 18h12l-10 7 4 13-10-7-10 7 4-13L8 18h12z" fill={gold} />
          <path d="M24 12 26.5 19h7l-5.5 4 2 7L24 26l-6 4 2-7-5.5-4h7z" fill="#F3D78A" />
        </g>
      );
    case "sun":
      return (
        <g>
          {Array.from({ length: 12 }, (_, index) => {
            const angle = (index / 12) * Math.PI * 2;
            const x1 = 24 + Math.cos(angle) * 12;
            const y1 = 24 + Math.sin(angle) * 12;
            const x2 = 24 + Math.cos(angle) * 20;
            const y2 = 24 + Math.sin(angle) * 20;
            return <path key={index} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={gold} strokeWidth="2" strokeLinecap="round" />;
          })}
          <circle cx="24" cy="24" r="9" fill="#F0B429" />
          <circle cx="21" cy="21" r="3" fill="#F8E2A0" />
        </g>
      );
    case "heart":
      return (
        <g>
          <path d="M24 40C12 32 8 24 8 18a8 8 0 0 1 14-4 8 8 0 0 1 14 4c0 6-4 14-12 22z" fill={coral} />
          <path d="M16 16a4 4 0 0 1 4 3" fill="none" stroke="#F4C7C0" strokeWidth="1.5" />
          <circle cx="24" cy="22" r="3" fill="none" stroke={gold} strokeWidth="1.4" />
          <path d="M24 20v4M22 22h4" stroke={gold} strokeWidth="1" />
        </g>
      );
    case "leaf":
      return (
        <g>
          <path d="M24 42C12 30 10 16 18 8c12 2 20 14 16 28-2 2-6 4-10 6z" fill={teal} />
          <path d="M20 36c4-8 8-16 14-24" fill="none" stroke="#D7F3EA" strokeWidth="1.4" />
          <path d="M18 24c4 1 6 4 6 8M22 18c3 1 5 3 6 6" fill="none" stroke="#0E3E36" strokeWidth="1" />
        </g>
      );
    case "boat":
      return (
        <g>
          <path d="M6 30h36l-4 8H12z" fill={ink} />
          <path d="M10 30c6 4 22 4 28 0" fill="none" stroke="#7EB6C9" strokeWidth="2" />
          <path d="M24 30V12" stroke={ink} strokeWidth="1.6" />
          <path d="M24 12 36 26H24z" fill={coral} />
          <path d="M24 16 16 26h8z" fill={cream} />
          <circle cx="16" cy="26" r="1.3" fill={gold} />
        </g>
      );
    case "compass":
      return (
        <g>
          <circle cx="24" cy="24" r="16" fill={cream} stroke={ink} strokeWidth="2" />
          <circle cx="24" cy="24" r="12" fill="none" stroke={gold} strokeWidth="1" />
          <path d="M24 10v3M24 35v3M10 24h3M35 24h3" stroke={ink} strokeWidth="1.4" />
          <path d="M24 14 28 24 24 34 20 24z" fill={coral} />
          <path d="M24 14 20 24h8z" fill="#F0B429" />
          <circle cx="24" cy="24" r="1.6" fill={ink} />
        </g>
      );
    case "camera":
      return (
        <g>
          <rect x="8" y="16" width="32" height="22" rx="3" fill={ink} />
          <path d="M18 16 21 11h8l3 5" fill="#3A2412" />
          <circle cx="24" cy="27" r="7" fill="#163044" stroke={gold} strokeWidth="1.5" />
          <circle cx="24" cy="27" r="3" fill="#9FD0DE" />
          <circle cx="34" cy="21" r="1.3" fill={gold} />
        </g>
      );
    case "balloon":
      return (
        <g>
          <path d="M24 34c6 6 2 8 0 10" fill="none" stroke={ink} strokeWidth="1.2" />
          <ellipse cx="24" cy="20" rx="10" ry="13" fill={coral} />
          <ellipse cx="20" cy="16" rx="3" ry="5" fill="#F0B8B0" opacity="0.8" />
          <path d="M20 32h8l-4 4z" fill={gold} />
        </g>
      );
    case "moon":
      return (
        <g>
          <path d="M30 8c-8 3-14 11-14 20s6 17 14 20c-9-2-16-10-16-20S21 10 30 8z" fill="#F3D78A" />
          <circle cx="18" cy="18" r="1.1" fill="#C4922A" />
          <circle cx="16" cy="26" r="1.5" fill="#C4922A" />
          <circle cx="22" cy="30" r="1" fill="#C4922A" />
        </g>
      );
    case "flower":
      return (
        <g>
          {[0, 60, 120, 180, 240, 300].map((turn) => (
            <ellipse key={turn} cx="24" cy="14" rx="4" ry="7" fill={coral} transform={`rotate(${turn} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="4" fill={gold} />
          <path d="M24 28v12" stroke={teal} strokeWidth="1.6" />
        </g>
      );
    default:
      return (
        <g>
          <path d="M24 40c-8-8-12-14-8-22 4-2 8 2 8 6 0-4 4-8 8-6 4 8 0 14-8 22z" fill={coral} />
          <path d="M24 16c2-6 6-8 8-8-1 4-1 6 0 8" fill={teal} />
          <path d="M22 28c2 2 4 2 6 0" fill="none" stroke="#F6C9C2" strokeWidth="1" />
        </g>
      );
  }
}
