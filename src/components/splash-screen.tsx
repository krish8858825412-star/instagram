"use client";

import { LogoIcon } from "@/components/icons";

export function SplashScreen() {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center bg-background"
      aria-label="Loading application"
    >
      <div className="animation-breathing">
        <LogoIcon className="h-24 w-24 text-primary" />
      </div>
    </div>
  );
}
