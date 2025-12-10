"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const patterns = (color: string) => [
  // Dots
  {
    backgroundImage: `radial-gradient(circle at 1px 1px, ${color} 1px, transparent 0)`,
    backgroundSize: "2rem 2rem",
    opacity: 0.3,
  },
  // Grid
  {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(to right, ${color} 1px, transparent 1px)`,
    backgroundSize: "2rem 2rem",
    opacity: 0.2,
  },
  // Diagonal Lines
  {
    backgroundImage: `repeating-linear-gradient(45deg, ${color}, ${color} 1px, transparent 1px, transparent 2rem)`,
    opacity: 0.2,
  },
  // Squares
  {
    backgroundImage: `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color} 75%), linear-gradient(-45deg, transparent 75%, ${color} 75%)`,
    backgroundSize: '2rem 2rem',
    opacity: 0.15,
  }
];

export function AnimatedBackground() {
  const [hue, setHue] = useState(0);
  const [patternStyle, setPatternStyle] = useState({});

  useEffect(() => {
    // Select a random pattern only on the client-side
    const allPatterns = patterns("currentColor"); // Placeholder color
    const randomIndex = Math.floor(Math.random() * allPatterns.length);
    setPatternStyle(allPatterns[randomIndex]);

    const interval = setInterval(() => {
      setHue((prevHue) => (prevHue + 1) % 360);
    }, 50); // Change color every 50ms for smooth transition

    return () => clearInterval(interval);
  }, []);

  const dynamicColor = `hsl(${hue}, 70%, 50%)`;

  // Clone the selected pattern style and replace the color
  const finalPatternStyle = {
    ...patternStyle,
    backgroundImage: (patternStyle as any).backgroundImage?.replace(/currentColor/g, dynamicColor),
  };

  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 h-full w-full bg-background"
      )}
    >
      <div
        className="absolute inset-0 h-full w-full animate-move"
        style={finalPatternStyle}
      />
    </div>
  );
}
