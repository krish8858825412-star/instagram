
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Users, ThumbsUp, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const features = [
    { title: "Get Followers", icon: Users, href: "/order/followers" },
    { title: "Get Likes", icon: ThumbsUp, href: "/order/likes" },
    { title: "Get Comments", icon: MessageSquare, href: "/order/comments" },
    { title: "Get Views", icon: Eye, href: "/order/views" },
  ];

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20 hover:border-primary/80 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                <feature.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full mt-4">
                  <Link href={feature.href}>Proceed</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
