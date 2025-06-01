import type React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("container px-4 py-6 mx-auto max-w-5xl", className)}>
      {children}
    </div>
  );
}
