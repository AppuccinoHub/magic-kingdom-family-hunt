import { stampFill } from "@/lib/card-style";

const ink = "#14233C";
const coral = "#E36A4F";
const gold = "#E3B341";
const teal = "#1F8A70";
const navy = "#1B3A6B";
const cream = "#FFF8EF";

function stroke() {
  return { fill: "none" as const, stroke: ink, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
}

/** One welcome parade. Hunt ideas, not a copy of any park icon. */
export function AdventureParade({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 230" className={className} role="img" aria-label="A cartoon parade with a lantern, carousel horse, flying elephant, mine train, rocket, and ice cream">
      <rect width="360" height="230" fill="#2C1870" />
      <circle cx="326" cy="34" r="20" fill="#FFE08A" stroke={ink} strokeWidth="3" />
      <Firework x={46} y={36} color={coral} />
      <Firework x={150} y={28} color={gold} />
      <Star x={104} y={22} light />
      <Star x={214} y={26} light />
      <Balloon x={24} y={72} color={coral} string={108} />
      <Balloon x={52} y={58} color={gold} string={104} />
      <Balloon x={78} y={76} color="#7EC8E3" string={100} />
      <Lantern x={196} y={8} />
      <path d="M0 176c48-20 96-8 150 8 52 16 96 2 150-12 28-8 42-4 60 6v52H0z" fill="#3A237F" />
      <g transform="translate(6,124) scale(0.55)">
        <Horse x={0} y={0} />
      </g>
      <g transform="translate(92,112) scale(0.62)">
        <Elephant x={0} y={0} />
      </g>
      <g transform="translate(188,132) scale(0.62)">
        <Train x={0} y={0} />
      </g>
      <g transform="translate(268,108) scale(0.62)">
        <Rocket x={0} y={0} />
      </g>
      <g transform="translate(312,154) scale(0.42)">
        <IceCream x={0} y={0} />
      </g>
    </svg>
  );
}

export function FireworkSky({ className, motion }: { className?: string; motion: boolean }) {
  return (
    <svg viewBox="0 0 320 90" className={className} aria-hidden="true">
      <rect width="320" height="90" fill="#1B3A6B" rx="20" />
      <g className={motion ? "firework-once" : undefined}>
        <Firework x={70} y={46} color={gold} />
        <Firework x={160} y={36} color={coral} />
        <Firework x={250} y={50} color="#7EC8E3" />
      </g>
      <Star x={28} y={24} light />
      <Star x={118} y={18} light />
      <Star x={210} y={22} light />
      <Star x={292} y={28} light />
    </svg>
  );
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
      <svg viewBox="30 28 100 100" className={className} aria-hidden="true">
        <circle cx="80" cy="78" r="46" fill={stampFill(name)} stroke={ink} strokeWidth="4" />
        <Motif name={name} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 180" className={className} aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        return <circle key={index} cx={80 + Math.cos(angle) * 74} cy={78 + Math.sin(angle) * 74} r="4" fill={cream} stroke={ink} strokeWidth="2" />;
      })}
      <circle cx="80" cy="78" r="66" fill={cream} stroke={ink} strokeWidth="4" />
      <circle cx="80" cy="78" r="56" fill={stampFill(name)} stroke={gold} strokeWidth="6" />
      <Motif name={name} />
      {found ? (
        <g>
          <rect x="30" y="138" width="100" height="32" rx="16" fill="#8E2618" />
          <text x="80" y="160" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Atkinson Hyperlegible, sans-serif">
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
      return <Elephant x={30} y={28} />;
    case "vehicle":
      return <Horse x={30} y={34} />;
    case "lamp":
      return <Lantern x={48} y={26} />;
    case "cart":
      return <Train x={34} y={40} />;
    case "badge":
      return <Rocket x={52} y={30} />;
    case "cup":
      return <IceCream x={48} y={36} />;
    case "camel":
      return <Camel x={34} y={36} />;
    case "river":
      return <Boat x={34} y={40} />;
    case "paw":
      return <Paw x={42} y={36} />;
    case "baseball":
      return <Baseball x={46} y={40} />;
    case "flag":
      return <Flag x={48} y={30} />;
    case "peanut":
      return <Peanut x={48} y={32} />;
    case "sniff":
      return <Treat x={40} y={34} />;
    case "antlers":
      return <Antlers x={36} y={30} />;
    case "lizard":
      return <Lizard x={36} y={40} />;
    case "bat":
      return <Bat x={34} y={40} />;
    case "search":
      return <Search x={40} y={34} />;
    case "question":
      return <Question x={48} y={32} />;
    case "spark":
      return <Sparkle x={40} y={32} />;
    case "fountain":
      return <Fountain x={40} y={30} />;
    case "bag":
      return <Bag x={46} y={34} />;
    case "letter":
      return <Letter x={40} y={40} />;
    case "door":
      return <FrameArt x={42} y={30} />;
    case "tiles":
      return <Tiles x={40} y={36} />;
    case "castle":
      return <Camera x={40} y={36} />;
    default:
      return <Star x={62} y={58} />;
  }
}

function Firework({ x, y, color }: { x: number; y: number; color: string }) {
  const rays = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    return `M ${x + Math.cos(angle) * 8} ${y + Math.sin(angle) * 8} L ${x + Math.cos(angle) * 22} ${y + Math.sin(angle) * 22}`;
  }).join(" ");
  return (
    <g>
      <path d={rays} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy={y} r="4" fill={cream} stroke={ink} strokeWidth="2" />
    </g>
  );
}

function Star({ x, y, light = false }: { x: number; y: number; light?: boolean }) {
  return <polygon points={starPoints(x, y, 10, 4)} fill={light ? cream : gold} stroke={ink} strokeWidth="2" />;
}

function starPoints(x: number, y: number, outer: number, inner: number) {
  return Array.from({ length: 8 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (index * Math.PI) / 4;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(" ");
}

function Balloon({ x, y, color, string }: { x: number; y: number; color: string; string: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 28} C ${x - 4} ${string}, ${x + 6} ${string - 10}, ${x} ${string}`} stroke={ink} strokeWidth="2" fill="none" />
      <ellipse cx={x} cy={y} rx="16" ry="20" fill={color} stroke={ink} strokeWidth="3" />
      <path d={`M${x - 5} ${y + 18} h10 l-5 6z`} fill={color} stroke={ink} strokeWidth="3" />
    </g>
  );
}

function Lantern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} v16`} stroke={ink} strokeWidth="3" />
      <rect x={x - 14} y={y + 16} width="28" height="34" rx="8" fill={gold} stroke={ink} strokeWidth="3" />
      <rect x={x - 8} y={y + 24} width="16" height="16" rx="3" fill="#FFF4C2" stroke={ink} strokeWidth="2" />
      <path d={`M${x - 10} ${y + 50} h20`} stroke={ink} strokeWidth="3" />
    </g>
  );
}

function Horse({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 58} ${y - 8} v78`} stroke={gold} strokeWidth="6" />
      <path d={`M${x + 8} ${y + 34} q20 -8 36 0`} stroke={ink} strokeWidth="3" fill="none" />
      <ellipse cx={x + 28} cy={y + 36} rx="26" ry="14" fill={cream} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 46} ${y + 28} q16 -24 8 -36 q-14 8 -18 20z`} fill={cream} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 40} ${y + 8} q8 -16 18 -8`} stroke={coral} strokeWidth="4" fill="none" />
      <circle cx={x + 58} cy={y + 2} r="2" fill={ink} />
      <path d={`M${x + 18} ${y + 28} h22 v8 h-22z`} fill={coral} stroke={ink} strokeWidth="2" />
      <path d={`M${x + 16} ${y + 48} v16 M${x + 28} ${y + 50} v14 M${x + 40} ${y + 48} v16`} stroke={ink} strokeWidth="3" />
    </g>
  );
}

function Elephant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x + 36} cy={y + 70} rx="26" ry="9" fill={cream} stroke={ink} strokeWidth="3" />
      <ellipse cx={x + 34} cy={y + 42} rx="28" ry="20" fill="#C5CED6" stroke={ink} strokeWidth="3" />
      <circle cx={x + 10} cy={y + 38} r="13" fill="#E7B4C4" stroke={ink} strokeWidth="3" />
      <circle cx={x + 56} cy={y + 36} r="11" fill="#E7B4C4" stroke={ink} strokeWidth="3" />
      <circle cx={x + 64} cy={y + 30} r="11" fill="#C5CED6" stroke={ink} strokeWidth="3" />
      <path d={`M${x + 70} ${y + 36} q8 16 -2 26`} stroke={ink} strokeWidth="3" fill="none" />
      <circle cx={x + 68} cy={y + 28} r="2" fill={ink} />
      <path d={`M${x + 24} ${y + 28} h18`} stroke={teal} strokeWidth="4" />
    </g>
  );
}

function Train({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 28} h70 l-8 22 h-54z`} fill={gold} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 8} ${y + 8} h40 l10 20 h-50z`} fill={coral} stroke={ink} strokeWidth="3" />
      <circle cx={x + 18} cy={y + 52} r="7" fill={navy} stroke={ink} strokeWidth="3" />
      <circle cx={x + 46} cy={y + 52} r="7" fill={navy} stroke={ink} strokeWidth="3" />
      <rect x={x + 20} y={y + 32} width="16" height="10" rx="2" fill={cream} stroke={ink} strokeWidth="2" />
    </g>
  );
}

function Rocket({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 46} l8 -16 h-16z`} fill={coral} stroke={ink} strokeWidth="3" />
      <path d={`M${x - 8} ${y + 46} l8 -16 h-8z`} fill={coral} stroke={ink} strokeWidth="3" />
      <rect x={x - 10} y={y + 8} width="28" height="40" rx="14" fill={cream} stroke={ink} strokeWidth="3" />
      <circle cx={x + 4} cy={y + 24} r="6" fill="#7EC8E3" stroke={ink} strokeWidth="2" />
      <path d={`M${x - 4} ${y + 50} h16 l-8 14z`} fill={gold} stroke={ink} strokeWidth="3" />
    </g>
  );
}

function IceCream({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 28} l14 36 l14 -36z`} fill="#F2C48D" stroke={ink} strokeWidth="3" />
      <circle cx={x + 14} cy={y + 24} r="14" fill={coral} stroke={ink} strokeWidth="3" />
      <circle cx={x + 14} cy={y + 12} r="12" fill={gold} stroke={ink} strokeWidth="3" />
      <circle cx={x + 14} cy={y} r="4" fill={teal} stroke={ink} strokeWidth="2" />
    </g>
  );
}

function Camel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 10} ${y + 40} q20 -36 40 -8 q10 8 16 0`} fill="#E3B341" stroke={ink} strokeWidth="3" />
      <circle cx={x + 70} cy={y + 28} r="10" fill="#E3B341" stroke={ink} strokeWidth="3" />
      <path d={`M${x + 18} ${y + 42} v18 M${x + 34} ${y + 44} v16 M${x + 52} ${y + 42} v18`} {...stroke()} />
      <circle cx={x + 46} cy={y + 8} r="3" fill="#7EC8E3" stroke={ink} strokeWidth="2" />
    </g>
  );
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 36} q30 18 70 0 l-8 16 h-54z`} fill={navy} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 34} ${y + 36} v-40`} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 34} ${y - 4} l28 18 h-28z`} fill={coral} stroke={ink} strokeWidth="3" />
      <circle cx={x + 18} cy={y + 28} r="4" fill={gold} />
    </g>
  );
}

function Paw({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x + 28} cy={y + 40} rx="18" ry="14" fill={coral} stroke={ink} strokeWidth="3" />
      <circle cx={x + 8} cy={y + 18} r="7" fill={gold} stroke={ink} strokeWidth="3" />
      <circle cx={x + 24} cy={y + 10} r="7" fill={gold} stroke={ink} strokeWidth="3" />
      <circle cx={x + 42} cy={y + 16} r="7" fill={gold} stroke={ink} strokeWidth="3" />
    </g>
  );
}

function Baseball({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x + 24} cy={y + 28} r="22" fill={cream} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 12} ${y + 14} q12 14 0 28 M${x + 36} ${y + 14} q-12 14 0 28`} stroke={coral} strokeWidth="3" fill="none" />
    </g>
  );
}

function Flag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} v64`} stroke={ink} strokeWidth="4" />
      <path d={`M${x} ${y + 4} h36 l-8 14 8 14 h-36z`} fill={coral} stroke={ink} strokeWidth="3" />
    </g>
  );
}

function Peanut({ x, y }: { x: number; y: number }) {
  return <path d={`M${x + 18} ${y + 8} c16 -8 28 8 18 22 c14 4 10 24 -6 28 c-8 12 -28 8 -30 -2 c-14 -4 -16 -24 -2 -32 c-6 -12 8 -20 20 -16z`} fill="#E7C07A" stroke={ink} strokeWidth="3" />;
}

function Treat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y + 20} width="44" height="28" rx="8" fill={coral} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 8} ${y + 20} v-10 q14 -16 28 0 v10`} fill={gold} stroke={ink} strokeWidth="3" />
      <circle cx={x + 34} cy={y + 8} r="4" fill={teal} />
    </g>
  );
}

function Antlers({ x, y }: { x: number; y: number }) {
  return <path d={`M${x + 20} ${y + 60} v-24 M${x + 48} ${y + 60} v-24 M${x + 20} ${y + 36} c-16 -4 -18 -28 -4 -36 M${x + 48} ${y + 36} c16 -4 18 -28 4 -36 M${x + 16} ${y + 24} c-10 0 -12 -12 -2 -16 M${x + 52} ${y + 24} c10 0 12 -12 2 -16`} {...stroke()} />;
}

function Lizard({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x + 36} cy={y + 28} rx="28" ry="14" fill={teal} stroke={ink} strokeWidth="3" />
      <circle cx={x + 62} cy={y + 20} r="8" fill={teal} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 8} ${y + 28} q-12 10 -4 18`} stroke={ink} strokeWidth="3" fill="none" />
      <circle cx={x + 66} cy={y + 18} r="2" fill={ink} />
    </g>
  );
}

function Bat({ x, y }: { x: number; y: number }) {
  return <path d={`M${x + 36} ${y + 28} c-8 -20 -28 -24 -40 -8 c8 8 10 16 4 24 c12 0 20 6 28 12 c8 -6 16 -12 28 -12 c-6 -8 -4 -16 4 -24 c-12 -16 -32 -12 -40 8z`} fill={navy} stroke={ink} strokeWidth="3" />;
}

function Search({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x + 24} cy={y + 24} r="16" fill={cream} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 36} ${y + 36} l14 16`} stroke={ink} strokeWidth="4" />
    </g>
  );
}

function Question({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x + 24} cy={y + 28} r="24" fill="#F4A3C8" stroke={ink} strokeWidth="3" />
      <path d={`M${x + 16} ${y + 20} q0 -12 16 -8 q10 2 6 12 q-6 8 -6 12`} {...stroke()} />
      <circle cx={x + 24} cy={y + 42} r="2" fill={ink} />
    </g>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Star x={x + 24} y={y + 28} />
      <Star x={x + 52} y={y + 12} />
      <circle cx={x + 8} cy={y + 18} r="4" fill={coral} stroke={ink} strokeWidth="2" />
    </g>
  );
}

function Fountain({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 52} h56`} stroke={ink} strokeWidth="4" />
      <path d={`M${x + 10} ${y + 52} v-16 h36 v16`} fill="#7EC8E3" stroke={ink} strokeWidth="3" />
      <path d={`M${x + 28} ${y + 36} v-20`} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 28} ${y + 16} q-16 8 -12 16 M${x + 28} ${y + 16} q16 8 12 16`} stroke="#3C7CB5" strokeWidth="3" fill="none" />
      <circle cx={x + 28} cy={y + 8} r="6" fill={gold} stroke={ink} strokeWidth="2" />
    </g>
  );
}

function Bag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y + 20} h40 l-4 36 h-32z`} fill={coral} stroke={ink} strokeWidth="3" />
      <path d={`M${x + 18} ${y + 20} v-8 q10 -12 20 0 v8`} {...stroke()} />
    </g>
  );
}

function Letter({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="52" height="36" rx="4" fill={cream} stroke={ink} strokeWidth="3" />
      <path d={`M${x} ${y} l26 18 l26 -18`} {...stroke()} />
    </g>
  );
}

function FrameArt({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="46" height="56" rx="4" fill="#C9894A" stroke={ink} strokeWidth="3" />
      <rect x={x + 8} y={y + 8} width="30" height="28" fill="#7EB6D9" stroke={ink} strokeWidth="2" />
      <circle cx={x + 36} cy={y + 46} r="3" fill={gold} />
    </g>
  );
}

function Tiles({ x, y }: { x: number; y: number }) {
  const colors = [coral, gold, teal, "#7EC8E3", cream, "#F4A3C8"];
  return (
    <g>
      {colors.map((color, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return <rect key={color + index} x={x + col * 18} y={y + row * 18} width="16" height="16" rx="2" fill={color} stroke={ink} strokeWidth="2" />;
      })}
    </g>
  );
}

function Camera({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y + 14} width="56" height="36" rx="8" fill={navy} stroke={ink} strokeWidth="3" />
      <circle cx={x + 28} cy={y + 32} r="10" fill="#7EC8E3" stroke={ink} strokeWidth="3" />
      <rect x={x + 8} y={y + 6} width="16" height="10" rx="2" fill={gold} stroke={ink} strokeWidth="2" />
    </g>
  );
}
