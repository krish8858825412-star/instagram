"use client";

import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { SplashScreen } from "@/components/splash-screen";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {isAppLoading ? <SplashScreen /> : children}
    </AuthProvider>
  );
}
