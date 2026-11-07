import { stampFill } from "@/lib/card-style";

const cream = "#F6E7C8";
const gold = "#E3B341";
const deep = "#8C6418";
const coral = "#E36A4F";
const mist = "#D5DDE4";
const slate = "#8E9AAB";
const teal = "#7DCFC3";
const night = "#1A0C40";

/** Bright daytime travel poster. Original scene, not a park logo or a character. */
export function DayExplore({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 220" className={className} role="img" aria-label="A bright daytime travel poster of a path, trees, a horse, and an elephant">
      <rect width="360" height="220" fill="#8ED4F2" />
      <ellipse cx="70" cy="36" rx="46" ry="16" fill="#fff" opacity="0.85" />
      <ellipse cx="96" cy="40" rx="28" ry="12" fill="#fff" />
      <ellipse cx="250" cy="28" rx="40" ry="14" fill="#fff" opacity="0.8" />
      <circle cx="300" cy="42" r="16" fill="#F6C445" />
      <circle cx="294" cy="38" r="6" fill="#FFE9A8" />
      <path d="M0 150c40-28 80-20 120-8 36 10 70 8 110-12 30-16 70-10 130 8v82H0z" fill="#7EBF6A" />
      <path d="M0 168c60-18 100-8 160 4 50 10 90 2 200-16v64H0z" fill="#3E8F55" />
      <path d="M150 220c-10-40 8-70 28-78 18 10 34 40 24 78z" fill="#D7B072" />
      <path d="M40 168c8-26 18-26 26 0" fill="#2F6B3A" />
      <circle cx="46" cy="132" r="16" fill="#1F8A4C" />
      <circle cx="62" cy="126" r="14" fill="#34A35A" />
      <path d="M250 172c8-30 18-30 26 0" fill="#2F6B3A" />
      <circle cx="256" cy="132" r="18" fill="#187A45" />
      <circle cx="274" cy="124" r="14" fill="#2E9B55" />
      <DayHorse />
      <DayElephant />
      <rect x="8" y="8" width="344" height="204" fill="none" stroke="#C4922A" strokeWidth="1.4" />
    </svg>
  );
}

export function AdventureParade({ className }: { className?: string }) {
  return <DayExplore className={className} />;
}

export function NightFireworks({ className, motion = false }: { className?: string; motion?: boolean }) {
  return (
    <svg viewBox="0 0 360 200" className={className} role="img" aria-label="A night travel poster with fireworks over a quiet town">
      <rect width="360" height="200" fill="#140A32" />
      <ellipse cx="180" cy="0" rx="220" ry="90" fill="#3A1C78" />
      <circle cx="300" cy="36" r="14" fill="#F6E2A8" />
      <circle cx="292" cy="30" r="12" fill="#3A1C78" />
      <g className={motion ? "firework-once" : undefined}>
        <Burst x={70} y={48} color={gold} />
        <Burst x={150} y={36} color={coral} />
        <Burst x={230} y={54} color={teal} />
        <Burst x={48} y={78} color="#F6E2A8" />
      </g>
      <Star x={24} y={24} r={3} />
      <Star x={110} y={18} r={2.2} />
      <Star x={196} y={22} r={2.6} />
      <Star x={260} y={16} r={2} />
      <path d="M0 150h360v50H0z" fill="#12082C" />
      <path d="M16 150v-28h14v-16h10v16h16v28zM90 150v-22h18v-20h12v42zM180 150v-34h22v34zM230 150v-18l16-22 16 22v18zM300 150v-26h14v-14h10v40z" fill="#1A0E3A" />
      <g fill="#F6E2A8">
        <rect x="22" y="130" width="3" height="5" />
        <rect x="34" y="118" width="3" height="5" />
        <rect x="98" y="136" width="3" height="5" />
        <rect x="188" y="128" width="3" height="5" />
        <rect x="308" y="124" width="3" height="5" />
      </g>
      <rect x="8" y="8" width="344" height="184" fill="none" stroke={gold} strokeWidth="1.4" />
    </svg>
  );
}

export function FireworkSky({ className, motion }: { className?: string; motion: boolean }) {
  return <NightFireworks className={className} motion={motion} />;
}

export function CollectibleStamp({
  name,
  found = false,
  compact = false,
  className,
}: {
  name: string;
  found?: boolean;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
        <circle cx="48" cy="48" r="46" fill={stampFill(name)} />
        <circle cx="48" cy="48" r="40" fill="none" stroke={gold} strokeWidth="1.6" />
        <g transform="translate(14,14) scale(0.7)">
          <Motif name={name} />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 180" className={className} aria-hidden="true">
      <circle cx="80" cy="78" r="70" fill="#140A32" />
      {Array.from({ length: 24 }, (_, index) => {
        const angle = (index / 24) * Math.PI * 2;
        return <circle key={index} cx={80 + Math.cos(angle) * 74} cy={78 + Math.sin(angle) * 74} r={index % 2 ? 1.6 : 2.4} fill={gold} />;
      })}
      <circle cx="80" cy="78" r="62" fill="none" stroke={gold} strokeWidth="1.5" />
      <circle cx="80" cy="78" r="56" fill={stampFill(name)} />
      <g transform="translate(32,30)">
        <Motif name={name} />
      </g>
      {found ? (
        <g>
          <path d="M28 140h104l-8 28H36z" fill="#8E2618" />
          <text x="80" y="160" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Atkinson Hyperlegible, sans-serif">
            Found
          </text>
        </g>
      ) : null}
    </svg>
  );
}

function Motif({ name }: { name: string }) {
  switch (name) {
    case "elephant":
      return <Elephant x={4} y={8} />;
    case "vehicle":
      return <Horse x={0} y={6} />;
    case "lamp":
      return <Lantern x={22} y={4} />;
    case "cart":
      return <Train x={6} y={16} />;
    case "badge":
      return <Rocket x={24} y={4} />;
    case "cup":
      return <IceCream x={26} y={6} />;
    case "camel":
      return <Camel x={2} y={10} />;
    case "river":
      return <Boat x={6} y={18} />;
    case "paw":
      return <Paw x={14} y={12} />;
    case "baseball":
      return <Baseball x={16} y={12} />;
    case "flag":
      return <Flag x={22} y={6} />;
    case "peanut":
      return <Peanut x={16} y={10} />;
    case "sniff":
      return <Treat x={16} y={14} />;
    case "antlers":
      return <Antlers x={10} y={8} />;
    case "lizard":
      return <Lizard x={6} y={22} />;
    case "bat":
      return <Bat x={4} y={16} />;
    case "search":
      return <Search x={12} y={10} />;
    case "question":
      return <Question x={16} y={8} />;
    case "spark":
      return <Sparkle x={8} y={8} />;
    case "fountain":
      return <Fountain x={12} y={6} />;
    case "bag":
      return <Bag x={18} y={10} />;
    case "letter":
      return <Letter x={12} y={20} />;
    case "door":
      return <FrameArt x={18} y={6} />;
    case "tiles":
      return <Tiles x={12} y={14} />;
    case "castle":
      return <Castle x={10} y={8} />;
    default:
      return <Star x={48} y={48} r={16} />;
  }
}

function Burst({ x, y, color }: { x: number; y: number; color: string }) {
  const rays = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2;
    const inner = index % 2 ? 4 : 6;
    const outer = index % 2 ? 16 : 24;
    return `M ${x + Math.cos(angle) * inner} ${y + Math.sin(angle) * inner} L ${x + Math.cos(angle) * outer} ${y + Math.sin(angle) * outer}`;
  }).join(" ");
  return (
    <g>
      <path d={rays} stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx={x} cy={y} r="2.2" fill={cream} />
    </g>
  );
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  return <polygon points={starPoints(x, y, r, r * 0.42)} fill={cream} />;
}

function starPoints(x: number, y: number, outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(" ");
}

function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 18} ${y} v10`} stroke={gold} strokeWidth="2" />
      <path d={`M${x + 8} ${y + 10} h20 l4 6 H4 z`} fill={deep} />
      <path d={`M${x + 4} ${y + 16} h28 v30 c0 6-6 10-14 10 s-14-4-14-10z`} fill={gold} />
      <path d={`M${x + 10} ${y + 22} h16 v16 H${x + 10}z`} fill="#FFF1C2" />
      <path d={`M${x + 18} ${y + 22} v16 M${x + 10} ${y + 30} h16`} stroke={deep} strokeWidth="1" />
      <path d={`M${x + 6} ${y + 54} h24 l-4 6 H${x + 10}z`} fill={deep} />
      <ellipse cx={x + 18} cy={y + 30} rx="6" ry="8" fill="#FFF8E4" opacity="0.45" />
    </g>
  );
}

function DayHorse() {
  return (
    <g>
      <path d="M78 168v28M96 170v26M118 168v28M136 166v26" stroke="#C4A574" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="112" cy="156" rx="42" ry="20" fill="#F4E4C4" />
      <path d="M142 148c16-18 28-34 26-48" stroke="#F4E4C4" strokeWidth="16" fill="none" strokeLinecap="round" />
      <ellipse cx="176" cy="96" rx="18" ry="11" fill="#F4E4C4" />
      <path d="M166 90l6-16 10 12z" fill="#8C3A2A" />
      <path d="M150 112c6 8 8 16 4 24" fill="none" stroke="#8C3A2A" strokeWidth="3" />
      <path d="M186 100c8 2 12 6 10 10" fill="none" stroke="#6B5344" strokeWidth="1.6" />
      <ellipse cx="178" cy="98" rx="1.6" ry="1.2" fill="#14233C" />
      <path d="M78 150c-12 6-14 16-4 18" fill="#F4E4C4" />
      <path d="M98 146h22v8H98z" fill="#C44536" />
    </g>
  );
}

function DayElephant() {
  return (
    <g>
      <path d="M214 186v22M232 188v20M268 186v22M286 184v20" stroke="#8FA0AE" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="248" cy="168" rx="48" ry="26" fill="#C5D0D8" />
      <ellipse cx="210" cy="156" rx="18" ry="24" fill="#E7B7C6" />
      <ellipse cx="292" cy="150" rx="20" ry="16" fill="#D5DEE6" />
      <path d="M306 156c16 8 18 28 8 40" fill="none" stroke="#8FA0AE" strokeWidth="7" strokeLinecap="round" />
      <path d="M300 172h8M298 182h8M300 192h6" stroke="#6E7C88" strokeWidth="1.4" />
      <path d="M304 158c6 1 8 2 10 0" fill="none" stroke="#C4922A" strokeWidth="1.6" />
      <ellipse cx="298" cy="146" rx="1.8" ry="1.3" fill="#14233C" />
      <path d="M230 160c10 8 28 8 38 0" fill="none" stroke="#8FA0AE" strokeWidth="3" />
    </g>
  );
}

function Horse({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(0.82)`}>
      <path d="M10 46c4-8 16-12 28-6 8 4 14 2 20-4 4-4 12-4 14 2 2 4-2 8-6 10 4 2 6 8 2 12-6 2-8 8-4 12 2 6-4 10-10 8-4 6-12 6-16 2-4 4-12 4-16 0-6 4-14 0-12-8 2-4 0-10 4-12-4-2-8-8-6-14 2-2 6-4 8-2z" fill={cream} />
      <path d="M48 18c4-8 12-10 12-2 0 6-6 8-8 12 4 0 8 4 6 8-6 0-10-4-10-8z" fill={cream} />
      <path d="M54 10c2-6 6-6 7-1" fill="#8C3A2A" />
      <path d="M46 16c4-4 7-2 5 2" fill="none" stroke="#8C3A2A" strokeWidth="1.6" />
      <ellipse cx="60" cy="22" rx="1.2" ry="0.9" fill={night} />
      <path d="M16 48h12v5H16z" fill={coral} />
      <path d="M14 52c1 8 0 12-2 14M26 54c1 6 0 10-1 12M38 52c2 6 1 10-1 12" stroke={cream} strokeWidth="2.4" fill="none" />
      <path d="M70 4v58" stroke={gold} strokeWidth="2.4" />
    </g>
  );
}

function Elephant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(0.9)`}>
      <path d="M14 36c0-12 12-20 26-18 6 1 12 5 14 10 6 0 12 5 10 11 3 2 4 6 1 9v6H16v-5c-6 0-8-5-4-13z" fill={mist} />
      <path d="M16 42c6 6 22 6 28 0v6H16z" fill={slate} />
      <path d="M12 28c-8 2-10 12-4 18 6 1 10-4 10-9 0-6-2-9-6-9z" fill="#E7B7C6" />
      <path d="M48 24c8 0 14 7 12 13-1 3-3 6-6 7 4 6 1 10-4 8-2-4-1-8 0-10-4 2-8-1-8-6 0-6 3-12 6-12z" fill={mist} />
      <path d="M58 38c6 3 7 10 4 16" fill="none" stroke="#6E7C88" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M56 44h4M55 48h4" stroke="#6E7C88" strokeWidth="1" />
      <ellipse cx="56" cy="30" rx="1.3" ry="1" fill={night} />
      <path d="M20 54v8M30 55v7M42 54v8" stroke="#A9B7C2" strokeWidth="3" />
    </g>
  );
}

function Train({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 28} h72 l-6 16 H${x + 8}z`} fill="#6E4B2A" />
      <path d={`M${x + 6} ${y + 30} h58 l-4 8 H${x + 10}z`} fill="#8C6240" />
      <path d={`M${x + 10} ${y + 8} h36 l8 20 H${x + 8}z`} fill={coral} />
      <path d={`M${x + 16} ${y + 12} h16 v8 H${x + 16}z`} fill="#F6E2A8" />
      <path d={`M${x + 18} ${y + 14} h5 v4 h-5z M${x + 26} ${y + 14} h5 v4 h-5z`} fill="#3A2412" />
      <circle cx={x + 22} cy={y + 46} r="7" fill="#241838" />
      <circle cx={x + 48} cy={y + 46} r="7" fill="#241838" />
      <circle cx={x + 22} cy={y + 46} r="2" fill={gold} />
      <circle cx={x + 48} cy={y + 46} r="2" fill={gold} />
      <path d={`M${x + 4} ${y + 24} h10`} stroke={gold} strokeWidth="2" />
    </g>
  );
}

function Rocket({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 4} ${y + 18} c0-16 8-28 14-28s14 12 14 28v22H${x + 4}z`} fill={cream} />
      <path d={`M${x + 10} ${y + 8} c2-6 8-10 8-10s6 4 8 10`} fill="none" stroke={gold} strokeWidth="1.2" />
      <circle cx={x + 18} cy={y + 24} r="6" fill="#163044" />
      <circle cx={x + 16} cy={y + 22} r="2" fill={teal} />
      <path d={`M${x - 2} ${y + 28} l8 8 h6 l-4-14z`} fill={coral} />
      <path d={`M${x + 28} ${y + 28} l4 14 h6 l-8-8z`} fill={coral} />
      <path d={`M${x + 10} ${y + 40} h16 l-8 14z`} fill={gold} />
      <path d={`M${x + 14} ${y + 44} h8 l-4 6z`} fill="#F6E2A8" />
    </g>
  );
}

function IceCream({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 6} ${y + 28} h28 l-4 28 c-1 4-6 6-10 6s-9-2-10-6z`} fill={cream} />
      <path d={`M${x + 10} ${y + 34} h20 M${x + 12} ${y + 42} h14 M${x + 14} ${y + 50} h8`} stroke="#E7D3B0" strokeWidth="1" />
      <path d={`M${x + 8} ${y + 20} c0-10 6-16 12-16s12 6 12 16v8H${x + 8}z`} fill={coral} />
      <path d={`M${x + 14} ${y + 12} c2-6 8-8 8-2`} fill="none" stroke="#F6C9C2" strokeWidth="1.4" />
      <circle cx={x + 20} cy={y + 8} r="3" fill={teal} />
    </g>
  );
}

function Camel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 40} c8-22 22-30 36-22 6 4 10 4 16-2 6-6 14-6 18 0 2 4 0 8-4 10-2 10-8 16-16 16H${x + 18}c-8 0-14-6-10-12z`} fill="#E7C48A" />
      <path d={`M${x + 20} ${y + 36} c8-8 22-8 32 0`} fill="none" stroke="#C4922A" strokeWidth="2" />
      <path d={`M${x + 62} ${y + 28} c8-2 14 2 14 8-6 2-12 0-14-4z`} fill="#E7C48A" />
      <ellipse cx={x + 74} cy={y + 30} rx="1.4" ry="1" fill={night} />
      <path d={`M${x + 70} ${y + 34} c4 2 6 2 8 0`} fill="none" stroke="#8C6418" strokeWidth="1" />
      <path d={`M${x + 18} ${y + 48} v14 M${x + 32} ${y + 50} v12 M${x + 52} ${y + 48} v14 M${x + 66} ${y + 46} v12`} stroke="#C4922A" strokeWidth="2.2" />
      <path d={`M${x + 46} ${y + 18} c4-8 10-8 12-2 2 2-2 4-6 4`} fill={teal} />
    </g>
  );
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 28} c16 14 48 14 68 0 l-8 14 H${x + 10}z`} fill="#163044" />
      <path d={`M${x + 8} ${y + 36} h52`} stroke={teal} strokeWidth="1.4" />
      <path d={`M${x + 34} ${y + 28} V${y}`} stroke={cream} strokeWidth="2" />
      <path d={`M${x + 34} ${y + 2} l26 16 H${x + 34}z`} fill={coral} />
      <path d={`M${x + 34} ${y + 8} l-16 12 h16z`} fill={cream} />
      <circle cx={x + 16} cy={y + 24} r="2" fill={gold} />
      <path d={`M${x + 4} ${y + 22} c10 4 20 4 30 0`} fill="none" stroke="#7EB6C9" strokeWidth="1.5" />
    </g>
  );
}

function Paw({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x + 28} cy={y + 40} rx="16" ry="12" fill={cream} />
      <ellipse cx={x + 28} cy={y + 42} rx="8" ry="5" fill="#E7D3B0" />
      <ellipse cx={x + 10} cy={y + 18} rx="6" ry="7" fill={gold} />
      <ellipse cx={x + 24} cy={y + 10} rx="6" ry="7" fill={gold} />
      <ellipse cx={x + 40} cy={y + 16} rx="6" ry="7" fill={gold} />
      <path d={`M${x + 22} ${y + 36} h4 M${x + 30} ${y + 38} h3`} stroke={deep} strokeWidth="1" />
    </g>
  );
}

function Baseball({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x + 26} cy={y + 28} r="20" fill={cream} />
      <path d={`M${x + 14} ${y + 14} c6 8 6 20 0 28 M${x + 38} ${y + 14} c-6 8-6 20 0 28`} fill="none" stroke={coral} strokeWidth="1.6" />
      <path d={`M${x + 16} ${y + 18} h-3 M${x + 17} ${y + 28} h-4 M${x + 16} ${y + 38} h-3 M${x + 36} ${y + 18} h3 M${x + 35} ${y + 28} h4 M${x + 36} ${y + 38} h3`} stroke={coral} strokeWidth="1" />
    </g>
  );
}

function Flag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y} v62`} stroke={cream} strokeWidth="3" />
      <path d={`M${x + 8} ${y + 4} h34 l-7 12 7 12 H${x + 8}z`} fill={coral} />
      <path d={`M${x + 8} ${y + 4} h12 v24 H${x + 8}z`} fill="#1A2744" />
      <path d={`M${x + 20} ${y + 16} h16 M${x + 22} ${y + 22} h12`} stroke={cream} strokeWidth="1" opacity="0.7" />
      <circle cx={x + 12} cy={y + 10} r="1" fill={gold} />
      <circle cx={x + 16} cy={y + 14} r="1" fill={gold} />
    </g>
  );
}

function Peanut({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 46} h48 v6 H${x + 8}z`} fill="#5C4632" opacity="0.35" />
      <path d={`M${x + 22} ${y + 8} c10-6 20 2 16 14 8 2 10 14 2 18-2 10-16 14-22 6-10 2-16-8-12-16-6-8 4-18 16-22z`} fill="#E7C48A" />
      <path d={`M${x + 28} ${y + 16} c4 6 4 16-2 24`} fill="none" stroke="#C4922A" strokeWidth="1.2" />
      <path d={`M${x + 30} ${y + 20} h3 M${x + 26} ${y + 28} h4 M${x + 32} ${y + 34} h3`} stroke="#8C6418" strokeWidth="1" />
    </g>
  );
}

function Treat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 4} ${y + 24} h48 v22 c0 4-4 8-10 8 H${x + 14} c-6 0-10-4-10-8z`} fill={coral} />
      <path d={`M${x + 4} ${y + 24} h48 v6 H${x + 4}z`} fill="#F0B429" />
      <path d={`M${x + 14} ${y + 18} c0-10 8-16 14-16 s14 6 14 16`} fill="none" stroke={cream} strokeWidth="2" />
      <path d={`M${x + 36} ${y + 8} c6-6 12-4 10 2`} fill="none" stroke={teal} strokeWidth="1.4" />
      <circle cx={x + 48} cy={y + 6} r="2" fill={teal} opacity="0.8" />
      <path d={`M${x + 16} ${y + 36} h24`} stroke="#F6C9C2" strokeWidth="1" />
    </g>
  );
}

function Antlers({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 18} ${y + 58} h36 l-4 8 H${x + 22}z`} fill="#6E4B2A" />
      <path d={`M${x + 28} ${y + 58} V36 M${x + 48} ${y + 58} V36`} stroke="#E7C48A" strokeWidth="3" />
      <path d={`M${x + 28} ${y + 36} c-14-2-20-16-12-28 M${x + 48} ${y + 36} c14-2 20-16 12-28`} fill="none" stroke="#E7C48A" strokeWidth="2.4" />
      <path d={`M${x + 20} ${y + 24} c-8 0-10-8-4-12 M${x + 56} ${y + 24} c8 0 10-8 4-12`} fill="none" stroke="#C4922A" strokeWidth="1.8" />
      <path d={`M${x + 22} ${y + 16} c-6-2-6-8-2-10 M${x + 54} ${y + 16} c6-2 6-8 2-10`} fill="none" stroke={cream} strokeWidth="1.4" />
    </g>
  );
}

function Lizard({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 24} c8-10 22-12 34-6 8 4 16 2 22-4 4 6 2 12-4 16 2 8-6 14-14 14-6 6-16 6-22 2-8 2-16-2-16-10 0-4 0-8 0-12z`} fill={teal} />
      <path d={`M${x + 20} ${y + 22} c8 4 18 4 26-2`} fill="none" stroke="#D7F3EA" strokeWidth="1.2" />
      <path d={`M${x + 18} ${y + 28} l-3 6 M${x + 28} ${y + 30} l-2 6 M${x + 40} ${y + 28} l2 6`} stroke="#0E3E36" strokeWidth="1" />
      <path d={`M${x + 62} ${y + 16} c6-2 10 2 8 6`} fill={teal} />
      <ellipse cx={x + 66} cy={y + 16} rx="1.3" ry="1" fill={night} />
      <path d={`M${x + 6} ${y + 26} c-6 4-6 10 0 12`} fill="none" stroke={teal} strokeWidth="2" />
    </g>
  );
}

function Bat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 40} ${y + 28} c-4-14-16-20-28-12 6 4 8 10 4 16-8-2-16 2-18 8 10 2 16 8 22 14 6-6 12-12 22-14-2-6-10-10-18-8 0-6 2-12 6-16 8-4 16 2 10 12z`} fill="#C9C2DC" />
      <path d={`M${x + 16} ${y + 24} c6 2 8 6 6 10 M${x + 64} ${y + 24} c-6 2-8 6-6 10`} fill="none" stroke="#241838" strokeWidth="1" />
      <path d={`M${x + 22} ${y + 20} l4 8 M${x + 58} ${y + 20} l-4 8 M${x + 30} ${y + 16} l2 10 M${x + 50} ${y + 16} l-2 10`} stroke="#8E84A8" strokeWidth="0.8" />
      <ellipse cx={x + 36} cy={y + 30} rx="1.2" ry="1" fill={night} />
      <ellipse cx={x + 46} cy={y + 30} rx="1.2" ry="1" fill={night} />
      <path d={`M${x + 38} ${y + 36} h6`} stroke={night} strokeWidth="1" />
    </g>
  );
}

function Search({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x + 24} cy={y + 24} r="16" fill="none" stroke={gold} strokeWidth="3" />
      <circle cx={x + 24} cy={y + 24} r="11" fill="none" stroke={cream} strokeWidth="1" />
      <path d={`M${x + 20} ${y + 18} c4-2 8 0 8 4`} fill="none" stroke="#F6E2A8" strokeWidth="1.2" />
      <path d={`M${x + 36} ${y + 36} l14 16`} stroke={gold} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${x + 46} ${y + 48} l6 4`} stroke={cream} strokeWidth="2" />
    </g>
  );
}

function Question({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 36} h40 l6-16 V${y + 12} H${x + 14} L${x + 8} ${y + 24}z`} fill={cream} />
      <path d={`M${x + 14} ${y + 12} h34 v6 H${x + 16}z`} fill={coral} />
      <path d={`M${x + 22} ${y + 26} c0-6 4-8 8-8 5 0 8 2 8 6 0 4-4 5-8 7v3`} fill="none" stroke={night} strokeWidth="1.8" />
      <circle cx={x + 30} cy={y + 40} r="1.4" fill={night} />
      <path d={`M${x + 44} ${y + 20} h8`} stroke={gold} strokeWidth="1.4" />
    </g>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 18} ${y + 40} h28 l-4 12 H${x + 22}z`} fill="#6E4B2A" />
      <path d={`M${x + 24} ${y + 40} V28 h16 v12`} fill={cream} />
      <path d={`M${x + 28} ${y + 28} c2-8 8-12 8-12`} fill="none" stroke={gold} strokeWidth="1.4" />
      <Star x={x + 22} y={y + 16} r={7} />
      <Star x={x + 48} y={y + 12} r={4} />
      <Star x={x + 58} y={y + 28} r={3} />
      <circle cx={x + 40} cy={y + 22} r="1.4" fill={teal} />
    </g>
  );
}

function Fountain({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 4} ${y + 62} h64 l-6 8 H${x + 10}z`} fill={slate} />
      <path d={`M${x + 14} ${y + 50} h44 v12 H${x + 14}z`} fill="#7EB6C9" />
      <path d={`M${x + 22} ${y + 40} h28 v10 H${x + 22}z`} fill={teal} />
      <path d={`M${x + 36} ${y + 40} V24`} stroke={cream} strokeWidth="2" />
      <path d={`M${x + 36} ${y + 24} c-12 4-16 12-10 16 M${x + 36} ${y + 24} c12 4 16 12 10 16`} fill="none" stroke="#D7F3EA" strokeWidth="1.6" />
      <path d={`M${x + 28} ${y + 16} h16 l-3 6 h-10z`} fill={gold} />
      <circle cx={x + 36} cy={y + 12} r="3" fill="#F6E2A8" />
    </g>
  );
}

function Bag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 10} ${y + 22} h40 l-4 36 H${x + 14}z`} fill={coral} />
      <path d={`M${x + 14} ${y + 22} h32 l-2 8 H${x + 16}z`} fill="#F0B429" />
      <path d={`M${x + 22} ${y + 22} v-8 c0-6 16-6 16 0 v8`} fill="none" stroke={cream} strokeWidth="2" />
      <path d={`M${x + 18} ${y + 40} h24`} stroke="#F6C9C2" strokeWidth="1" />
      <circle cx={x + 30} cy={y + 46} r="2" fill={gold} />
    </g>
  );
}

function Letter({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="64" height="42" rx="3" fill={cream} />
      <path d={`M${x} ${y} l32 22 L${x + 64} ${y}`} fill="none" stroke={coral} strokeWidth="1.6" />
      <path d={`M${x} ${y + 42} l20-16 M${x + 64} ${y + 42} l-20-16`} stroke="#E7D3B0" strokeWidth="1.2" />
      <circle cx={x + 32} cy={y + 20} r="5" fill={coral} />
      <path d={`M${x + 30} ${y + 20} h4`} stroke={cream} strokeWidth="1" />
    </g>
  );
}

function FrameArt({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="52" height="64" rx="2" fill="#6E4B2A" />
      <rect x={x + 6} y={y + 6} width="40" height="40" fill="#1A2744" />
      <circle cx={x + 34} cy={y + 16} r="4" fill="#F6E2A8" />
      <path d={`M${x + 10} ${y + 40} l10-12 8 8 6-6 8 10z`} fill="#1F6F62" />
      <path d={`M${x + 18} ${y + 52} h16`} stroke={gold} strokeWidth="2" />
      <circle cx={x + 44} cy={y + 56} r="2" fill={gold} />
    </g>
  );
}

function Tiles({ x, y }: { x: number; y: number }) {
  const colors = [coral, gold, teal, cream, "#C9C2DC", "#E7C48A"];
  return (
    <g>
      <path d={`M${x} ${y + 8} h64 v40 H${x}z`} fill="#1A1038" />
      <path d={`M${x + 8} ${y} h48 l8 8 H${x}z`} fill={gold} />
      {colors.map((color, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return <rect key={color + index} x={x + 8 + col * 16} y={y + 14 + row * 16} width="14" height="14" fill={color} />;
      })}
      <path d={`M${x + 8} ${y + 14} h48 M${x + 8} ${y + 30} h48 M${x + 24} ${y + 14} v32 M${x + 40} ${y + 14} v32`} stroke="#1A1038" strokeWidth="1" />
    </g>
  );
}

function Castle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 70} V36 h14 V22 h8 v14 h16 V22 h8 v14 h14 v34z`} fill={cream} />
      <path d={`M${x + 8} ${y + 36} h14 V28 h-14z M${x + 54} ${y + 36} h14 V28 h-14z`} fill="#E7D3B0" />
      <path d={`M${x + 10} ${y + 24} h4 v-6 h-4z M${x + 18} ${y + 24} h4 v-6 h-4z M${x + 56} ${y + 24} h4 v-6 h-4z M${x + 64} ${y + 24} h4 v-6 h-4z`} fill={cream} />
      <path d={`M${x + 30} ${y + 70} v-16 h16 v16`} fill="#2A1848" />
      <path d={`M${x + 34} ${y + 58} h8 v6 h-8z`} fill={gold} />
      <rect x={x + 16} y={y + 46} width="5" height="7" fill="#F6E2A8" />
      <rect x={x + 56} y={y + 46} width="5" height="7" fill="#F6E2A8" />
      <rect x={x + 36} y={y + 42} width="5" height="7" fill="#F6E2A8" />
      <path d={`M${x + 22} ${y + 18} h6 l-3-8z`} fill={coral} />
    </g>
  );
}
