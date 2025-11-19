import { PageHeader } from "@/components/ui/page-header";
import { LoadingScreen } from "@/components/loading-screen";

/**
 * Loading Screen Page
 * Server component that renders the loading screen while evaluation is in progress
 */
export default function LoadingPage() {
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

        {/* Loading Screen Card */}
        <LoadingScreen />
      </div>
    </main>
  );
}

