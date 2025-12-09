"use client";

import { cn } from "@/lib/utils";

export function AnimatedBackground() {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 h-full w-full bg-background"
      )}
    >
      <div className="absolute inset-0 h-full w-full bg-dot-pattern animate-move" />
    </div>
  );
}
