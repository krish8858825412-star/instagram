"use client";

import { LogoIcon } from "@/components/icons";

export function SplashScreen() {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center bg-background"
      aria-label="Loading application"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="animation-breathing">
          <LogoIcon className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground animation-focus-in">
          Instagram
        </h1>
      </div>
    </div>
  );
}
