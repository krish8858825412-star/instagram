"use client";

import { AuthProvider } from "@/contexts/auth-context";

export function AppProvider({ children }: { children: React.ReactNode }) {

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
