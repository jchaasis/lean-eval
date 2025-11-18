import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * BackButton Component
 * Secondary button for navigation back to previous page
 */
export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="bg-white border border-slate-200 text-[#0f172b] rounded-lg h-10 text-sm font-medium leading-5 tracking-[-0.1504px] flex items-center justify-center gap-2 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
      aria-label="Back to idea"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back
    </button>
  );
}

