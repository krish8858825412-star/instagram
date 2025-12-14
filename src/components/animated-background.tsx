
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
          radial-gradient(circle at 10% 20%, rgba(217, 70, 239, 0.2), transparent 70%),
          radial-gradient(circle at 90% 80%, rgba(56, 189, 248, 0.2), transparent 70%)
        `,
      }}
    />
  );
}
