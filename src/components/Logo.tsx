import Link from "next/link";

export const TILE_COLORS = [
  "var(--color-tile-rose)",
  "var(--color-tile-green)",
  "var(--color-tile-blue)",
  "var(--color-tile-yellow)",
] as const;

/**
 * wordmark officiel akelius (svg récupéré de akelius.fr/assets/img/akelius_logo.svg,
 * servi en local depuis /public).
 */
export function Wordmark({ className = "h-7" }: { className?: string }) {
  return (
    <img
      src="/akelius-logo.svg"
      alt="Akelius"
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  );
}

/** pastille « A » sur tuile navy arrondie — loaders, avatars */
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
      <Wordmark className="h-6 transition-opacity duration-200 group-hover:opacity-80 md:h-7" />
      {suffix && (
        <span className="text-sm font-semibold lowercase text-muted">{suffix}</span>
      )}
    </Link>
  );
}
