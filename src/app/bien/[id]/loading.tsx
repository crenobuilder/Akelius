import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="container-ak py-10">
      <div className="grid gap-2 lg:grid-cols-[2fr_1fr]">
        <div className="skeleton aspect-[16/10] !rounded-[var(--radius-ak)]" />
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:grid-rows-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton aspect-[16/10] !rounded-[var(--radius-ctl)]" />
          ))}
        </div>
      </div>
      <Loader label="chargement du bien…" />
    </div>
  );
}
