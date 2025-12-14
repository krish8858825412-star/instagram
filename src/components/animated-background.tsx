
"use client";

import { cn } from "@/lib/utils";

export function AnimatedBackground() {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 transition-all duration-1000 ease-in-out animation-breathing"
      )}
      style={{
        background: `
          radial-gradient(circle at 30% 40%, rgba(217, 70, 239, 0.25), transparent 40%),
          radial-gradient(circle at 70% 60%, rgba(56, 189, 248, 0.25), transparent 40%)
        `,
      }}
    />
  );
}
