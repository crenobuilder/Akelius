"use client";

import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='800' height='600' fill='#edebe6'/><text x='400' y='300' font-family='sans-serif' font-size='24' fill='#716c66' text-anchor='middle'>akelius</text></svg>`
  );

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * <img> avec fallback de marque si le chargement échoue.
 * L'état d'erreur est mémorisé par source : quand la prop `src` change
 * (galerie, vignettes), la nouvelle image est bien tentée.
 */
export default function SmartImage({ src, alt, className, loading = "lazy" }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = failedSrc === src;

  return (
    <img
      key={showFallback ? `fb-${src}` : src}
      src={showFallback ? FALLBACK : src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setFailedSrc(src)}
    />
  );
}
