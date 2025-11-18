import { IdeaIntakeForm, RefreshButton } from "@/components/idea-intake-form";

/**
 * Landing page / Idea Intake
 * Server component that renders the initial idea input form matching Figma design
 */
export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-start"
      style={{
        backgroundImage:
          "linear-gradient(148.031deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
      }}
    >
      <div className="w-full max-w-[864px] mx-auto px-4 pt-8 pb-0 flex flex-col gap-12 min-h-[720px]">
        {/* Header Section */}
        <header className="relative h-14 w-full">
          <div className="absolute inset-0 flex flex-col items-center">
            <h1 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] text-center">
              LeanEval
            </h1>
            <p className="text-base font-normal text-[#45556c] leading-6 tracking-[-0.3125px] text-center mt-2">
              Validate your startup idea with AI-powered Lean Startup analysis
            </p>
          </div>
          <div className="absolute right-0 top-0">
            <RefreshButton />
          </div>
        </header>

        {/* Main Form Card */}
        <IdeaIntakeForm />
      </div>
    </main>
  );
}

