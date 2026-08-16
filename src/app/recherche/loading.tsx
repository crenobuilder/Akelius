import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader label="recherche des logements…" />
    </div>
  );
}
