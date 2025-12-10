"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function AnimatedBackground() {
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHue((prevHue) => (prevHue + 1) % 360);
    }, 50); // Change color every 50ms for smooth transition

    return () => clearInterval(interval);
  }, []);

  const dotColor = `hsl(${hue}, 70%, 50%)`;

  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 h-full w-full bg-background"
      )}
    >
      <div
        className="absolute inset-0 h-full w-full animate-move"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
          backgroundSize: "2rem 2rem",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
