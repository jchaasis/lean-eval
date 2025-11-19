import { DashboardClient } from "@/components/dashboard-client";
import { PageHeader } from "@/components/ui/page-header";

/**
 * Evaluation Dashboard Page
 * Server component that displays the complete evaluation results
 */
export default function DashboardPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-start"
      style={{
        backgroundImage:
          "linear-gradient(148.031deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
      }}
    >
      <div className="w-full max-w-[864px] mx-auto px-4 pt-8 pb-12 flex flex-col gap-12 min-h-[720px]">
        {/* Header Section */}
        <PageHeader />

        {/* Dashboard Content - Client component to access context */}
        <DashboardClient />
      </div>
    </main>
  );
}

