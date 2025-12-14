
"use client";

import { cn } from "@/lib/utils";

export function AnimatedBackground() {

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 transition-all duration-1000 ease-in-out animation-breathing"
      )}
      style={{
        background: `radial-gradient(circle at center, rgba(29, 78, 216, 0.15), transparent 40%)`,
      }}
    />
  );
}

