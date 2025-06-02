import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = "success" | "warning" | "error" | "default" | "info";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  className?: string;
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const statusStyles = {
    success: "bg-green-100 text-green-800 hover:bg-green-100",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    error: "bg-red-100 text-red-800 hover:bg-red-100",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    default: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-base py-1 px-3 font-medium",
        statusStyles[status],
        className,
      )}
    >
      {text}
    </Badge>
  );
}
