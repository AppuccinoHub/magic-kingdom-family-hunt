type Props = { name: string; className?: string };

export function ChallengeIcon({ name, className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <IconShape name={name} />
    </svg>
  );
}

function IconShape({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "castle":
      return (
        <path {...common} d="M8 40V22h6v-6h4v6h12v-6h4v6h6v18M18 40v-8h12v8M14 18V8m10 4V8m10 10V8" />
      );
    case "lamp":
      return (
        <>
          <path {...common} d="M18 22a6 6 0 1 1 12 0c0 4-3 5-3 8h-6c0-3-3-4-3-8z" />
          <path {...common} d="M20 34h8M22 38h4M24 8v4M12 12l3 3M36 12l-3 3" />
        </>
      );
    case "vehicle":
      return <path {...common} d="M8 30h32l-3-10H14L8 30zm4 0v4m24-4v4M16 34a2 2 0 1 0 0.1 0M32 34a2 2 0 1 0 0.1 0M14 20h8" />;
    case "paw":
      return (
        <>
          <ellipse {...common} cx="24" cy="30" rx="8" ry="6" />
          <circle {...common} cx="14" cy="20" r="3" />
          <circle {...common} cx="22" cy="15" r="3" />
          <circle {...common} cx="30" cy="16" r="3" />
          <circle {...common} cx="36" cy="22" r="3" />
        </>
      );
    case "baseball":
      return <path {...common} d="M24 8a16 16 0 1 0 0 32 16 16 0 0 0 0-32zM16 14c4 4 4 16 0 20M32 14c-4 4-4 16 0 20" />;
    case "flag":
      return <path {...common} d="M14 40V8m0 0h20l-4 7 4 7H14" />;
    case "peanut":
      return <path {...common} d="M20 10c6 0 8 4 8 8 4 1 6 5 4 9-2 6-8 7-10 12-4 2-10-1-10-6 0-4-4-6-4-10 1-6 6-13 12-13z" />;
    case "sniff":
      return <path {...common} d="M16 28c0-8 4-14 8-14s8 6 8 14M24 14V8M10 20h6M32 20h6M12 30c4 6 20 6 24 0" />;
    case "antlers":
      return <path {...common} d="M18 40V26m12 14V26M18 26c-6-2-8-10-6-16m2 8c-4 0-6-4-4-8M30 26c6-2 8-10 6-16m-2 8c4 0 6-4 4-8" />;
    case "elephant":
      return <path {...common} d="M8 28c2-10 10-16 18-16 8 0 12 6 14 12 2 0 4 4 2 8h-6l-2 8h-6v-6H18v6h-6l-2-8H8z" />;
    case "lizard":
      return <path {...common} d="M10 30c6-2 8-10 14-10s6 8 12 6c2 6-4 12-10 10-4 4-10 2-14 0-4-2-6-4-2-6zM34 22l4-4M30 20l2-6" />;
    case "bat":
      return <path {...common} d="M24 26c-2-8-8-12-14-10 2 4 2 8 0 12 4 0 8 2 10 6 2-4 6-6 10-6-2-4-2-8 0-12-6-2-12 2-14 10z" />;
    case "search":
      return <path {...common} d="M22 14a8 8 0 1 0 0.1 0M28 28l8 8" />;
    case "river":
      return <path {...common} d="M8 18c4 3 6 3 10 0s6-3 10 0 6 3 10 0M8 26c4 3 6 3 10 0s6-3 10 0 6 3 10 0M8 34c4 3 6 3 10 0s6-3 10 0 6 3 10 0" />;
    case "question":
      return <path {...common} d="M18 18c0-4 4-6 8-6s6 2 6 5-3 4-6 6v3M26 36h.1" />;
    case "spark":
      return <path {...common} d="M24 6v10M24 32v10M6 24h10M32 24h10M12 12l6 6M30 30l6 6M36 12l-6 6M18 30l-6 6" />;
    case "fountain":
      return <path {...common} d="M10 38h28M16 38V28h16v10M24 28V16m-6 4c2-6 10-6 12 0M24 10a3 3 0 1 0 0.1 0" />;
    case "bag":
      return <path {...common} d="M14 18h20l-2 20H16L14 18zm6 0v-4a4 4 0 0 1 8 0v4" />;
    case "letter":
      return <path {...common} d="M8 14h32v22H8zM8 14l16 12L40 14" />;
    case "door":
      return <path {...common} d="M16 40V10h16v30M28 24h2M12 40h24" />;
    case "camel":
      return <path {...common} d="M8 34c6-2 8-8 14-10 4-6 10-6 14-2 2 2 4 0 6-2v8c-4 2-6 6-6 10H8zM30 16c2-4 6-4 8-2" />;
    case "tiles":
      return <path {...common} d="M8 8h10v10H8zM20 8h10v10H20zM32 8h8v10h-8zM8 20h10v10H8zM20 20h10v10H20zM32 20h8v10h-8zM8 32h10v8H8zM20 32h10v8H20zM32 32h8v8h-8z" />;
    case "cart":
      return <path {...common} d="M8 32h28l4-14H16M12 32l-4 6h28M18 38a3 3 0 1 0 0.1 0M32 38a3 3 0 1 0 0.1 0" />;
    case "cup":
      return <path {...common} d="M16 16h16v8a8 8 0 0 1-16 0zM32 18h4a4 4 0 0 1 0 8h-4M18 40h12M20 12c2-4 8-4 8 0" />;
    case "badge":
      return <path {...common} d="M24 8l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1z" />;
    default:
      return <circle {...common} cx="24" cy="24" r="10" />;
  }
}
