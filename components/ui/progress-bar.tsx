interface ProgressBarProps {
  progress: number;
  ariaLabel?: string;
}

/**
 * ProgressBar Component
 * Displays a progress bar with gradient fill
 */
export function ProgressBar({
  progress,
  ariaLabel = "Progress",
}: ProgressBarProps) {
  return (
    <div className="bg-slate-100 rounded-full h-2 w-full overflow-hidden">
      <div
        className="bg-gradient-to-r from-[#00bc7d] to-[#009966] h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      />
    </div>
  );
}

