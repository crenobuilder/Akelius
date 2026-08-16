"use client";

import { useEffect, useState } from "react";
import { TILE_COLORS, Wordmark } from "./Logo";

const KEY = "akelius.splash.seen";

/**
 * splash d’accueil : quatre tuiles colorées qui apparaissent en cascade,
 * puis le wordmark. joué une fois par session, ~1,7 s au total.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(KEY)) {
        window.sessionStorage.setItem(KEY, "1");
        setShow(true);
        const t = window.setTimeout(() => setShow(false), 1750);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* stockage indisponible : pas de splash */
    }
  }, []);

  if (!show) return null;

  return (
    <div className="splash-overlay" role="presentation" aria-hidden>
      <div className="grid grid-cols-2 gap-2.5">
        {TILE_COLORS.map((color, i) => (
          <span
            key={color}
            className="splash-tile h-12 w-12 rounded-[26%]"
            style={{ backgroundColor: color, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <p className="splash-word">
        <Wordmark className="text-3xl" />
      </p>
    </div>
  );
}
