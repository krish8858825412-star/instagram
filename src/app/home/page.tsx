
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AnimatedBackground } from "@/components/animated-background";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Skeleton className="h-screen w-full bg-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Welcome, {user.displayName || user.email?.split("@")[0]}
          </h1>
        </div>
        <Separator />
        <div className="grid gap-4 md:gap-8">
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20 relative overflow-hidden">
            <AnimatedBackground />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Your Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is your personal dashboard. More widgets and features coming soon!</p>
              </CardContent>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
