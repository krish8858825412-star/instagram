"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { GlobalStateProvider } from "@/contexts/state-context";

export function AppProvider({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
