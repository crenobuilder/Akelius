import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-72px)] items-center justify-center">
      <Loader label="recherche des logements…" />
    </div>
  );
}
