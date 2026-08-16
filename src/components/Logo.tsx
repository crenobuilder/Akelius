import Link from "next/link";

export const TILE_COLORS = [
  "var(--color-tile-rose)",
  "var(--color-tile-green)",
  "var(--color-tile-blue)",
  "var(--color-tile-yellow)",
] as const;

/** pastille « a » sur tuile navy arrondie — déclinable en toute taille */
export function LogoMark({ className = "h-8 w-8 text-base" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex select-none items-center justify-center rounded-[26%] bg-navy font-extrabold lowercase text-white ${className}`}
    >
      a
    </span>
  );
}

/** wordmark complet, cliquable */
export default function Logo({ suffix }: { suffix?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5 select-none">
      <LogoMark className="h-8 w-8 text-base transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3" />
      <span className="flex items-baseline gap-1">
        <span className="text-[1.4rem] font-extrabold lowercase tracking-tight text-navy">
          akelius
        </span>
        {suffix && (
          <span className="text-sm font-semibold lowercase text-muted">{suffix}</span>
        )}
      </span>
    </Link>
  );
}
