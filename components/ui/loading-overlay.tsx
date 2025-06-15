import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  transparent?: boolean;
}

export function LoadingOverlay({
  message = "로딩 중...",
  size = "lg",
  className,
  transparent = false,
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        transparent ? "bg-black/20" : "bg-white/80 backdrop-blur-sm",
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size={size} />
        <p id="loading-message" className="text-sm font-medium text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
}
