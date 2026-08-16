import Link from "next/link";

export const TILE_COLORS = [
  "var(--color-tile-rose)",
  "var(--color-tile-green)",
  "var(--color-tile-blue)",
  "var(--color-tile-yellow)",
] as const;

/**
 * wordmark akelius : « Akelius » navy avec le « e » rouge.
 * Approximation typographique du logo officiel — à remplacer par le SVG
 * officiel lors de l’intégration finale.
 */
export function Wordmark({ className = "text-2xl" }: { className?: string }) {
  return (
    <span
      className={`select-none font-extrabold tracking-tight text-navy ${className}`}
    >
      Ak
      <span style={{ color: "var(--color-logo-red)" }}>e</span>
      lius
    </span>
  );
}

/** pastille « A » sur tuile navy arrondie — favicon, loaders, avatars */
export function LogoMark({ className = "h-8 w-8 text-base" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex select-none items-center justify-center rounded-[26%] bg-navy font-extrabold text-white ${className}`}
    >
      A
    </span>
  );
}

/** logo complet cliquable (header) */
export default function Logo({ suffix }: { suffix?: string }) {
  return (
    <Link href="/" className="group flex items-baseline gap-2 select-none">
      <Wordmark className="text-2xl transition-opacity duration-200 group-hover:opacity-80" />
      {suffix && (
        <span className="text-sm font-semibold lowercase text-muted">{suffix}</span>
      )}
    </Link>
  );
}
