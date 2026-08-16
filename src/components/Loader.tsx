import { TILE_COLORS } from "./Logo";

/** loader de marque : quatre mini-tuiles qui pulsent en cascade */
export default function Loader({ label = "chargement…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16" role="status">
      <div className="grid grid-cols-2 gap-1.5">
        {TILE_COLORS.map((color, i) => (
          <span
            key={color}
            className="loader-tile h-5 w-5 rounded-[26%]"
            style={{ backgroundColor: color, animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
      <p className="text-sm lowercase text-muted">{label}</p>
    </div>
  );
}
