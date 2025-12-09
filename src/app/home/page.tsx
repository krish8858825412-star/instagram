"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { personalizedHomepageLayout } from "@/ai/flows/personalized-homepage-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [layoutSuggestion, setLayoutSuggestion] = useState<string | null>(null);
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.email) {
      const generateLayout = async () => {
        setIsLayoutLoading(true);
        setError(null);
        try {
          const userInfo = `The user's email is ${user.email}. The user has expressed interest in professional, modern, and minimalist UI/UX design. They appreciate clean layouts and informative dashboards.`;
          const result = await personalizedHomepageLayout({ userInfo });
          setLayoutSuggestion(result.layoutSuggestion);
        } catch (err) {
          console.error("Error generating homepage layout:", err);
          setError("We couldn't generate your personalized dashboard at this time. Please try again later.");
        } finally {
          setIsLayoutLoading(false);
        }
      };
      generateLayout();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Welcome, {user.displayName || user.email?.split("@")[0]}
          </h1>
        </div>
        <Separator />
        <div className="grid gap-4 md:gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Your Personalized Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              {isLayoutLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Generation Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div className="prose prose-sm max-w-none text-foreground">
                    <pre className="whitespace-pre-wrap font-body text-base">
                        {layoutSuggestion}
                    </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
