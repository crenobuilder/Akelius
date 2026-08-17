"use client";

import { useCallback, useEffect } from "react";
import SmartImage from "./SmartImage";

interface Props {
  photos: string[];
  index: number;
  onNavigate: (i: number) => void;
  onClose: () => void;
  title?: string;
}

/** galerie plein écran : flèches, clavier (← → échap), vignettes */
export default function Lightbox({ photos, index, onNavigate, onClose, title }: Props) {
  const prev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  );

  /* précharge les photos voisines pour une navigation instantanée */
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const j = (i + photos.length) % photos.length;
      const img = new window.Image();
      img.src = photos[j];
    });
  }, [index, photos]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [prev, next, onClose]);

  return (
    <div
      className="lightbox-in fixed inset-0 z-[2500] flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "galerie"}
      onClick={onClose}
    >
      {/* barre haute */}
      <div
        className="flex items-center justify-between px-5 py-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="min-w-0 truncate pr-4 text-sm font-semibold">{title}</p>
        <div className="flex items-center gap-4">
          <span className="text-sm tabular-nums text-white/70">
            {index + 1} / {photos.length}
          </span>
          <button
            onClick={onClose}
            aria-label="fermer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* image principale */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 py-2">
        <div onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full">
          <SmartImage
            src={photos[index]}
            alt={title ? `${title} — photo ${index + 1}` : `photo ${index + 1}`}
            className="max-h-[74vh] max-w-full rounded-[var(--radius-ctl)] object-contain shadow-[var(--shadow-float)]"
          />
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="photo précédente"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/25 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="photo suivante"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/25 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M10 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* vignettes */}
      {photos.length > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-5 pb-5 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((p, i) => (
            <button
              key={`${p}-${i}`}
              onClick={() => onNavigate(i)}
              aria-label={`photo ${i + 1}`}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all ${
                i === index
                  ? "ring-2 ring-white"
                  : "opacity-50 hover:opacity-90"
              }`}
            >
              <SmartImage src={p} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
