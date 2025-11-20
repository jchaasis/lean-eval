/**
 * Page Header Component
 * Shared header section used across pages with title and subtitle
 */
export function PageHeader() {
  return (
    <header className="relative h-14 w-full">
      <div className="absolute inset-0 flex flex-col items-center">
        <h1 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] text-center">
          LeanEval
        </h1>
        <p className="text-base font-normal text-[#45556c] leading-6 tracking-[-0.3125px] text-center mt-2">
          Validate your startup idea with AI-powered Lean Startup analysis
        </p>
      </div>
    </header>
  );
}

