import Spinner from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
