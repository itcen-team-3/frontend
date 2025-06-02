import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LargeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

export function LargeButton({
  children,
  variant = "default",
  className,
  ...props
}: LargeButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        "text-lg md:text-xl py-6 px-8 rounded-xl h-auto",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
