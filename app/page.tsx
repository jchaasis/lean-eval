import { IdeaIntakeForm } from "@/components/idea-intake-form";
import { PageHeader } from "@/components/ui/page-header";

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
        <PageHeader />

        {/* Main Form Card */}
        <IdeaIntakeForm />
      </div>
    </main>
  );
}

