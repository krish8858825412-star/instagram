
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ThumbsUp, MessageSquare, Eye, Wallet, ShoppingCart, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/contexts/state-context";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTypewriter } from "@/hooks/use-typewriter";

const features = [
    { title: "Get Followers", icon: Users, href: "/order/followers", description: "Increase your account's visibility and social proof with high-quality followers." },
    { title: "Get Likes", icon: ThumbsUp, href: "/order/likes", description: "Boost the engagement on your posts and reach a wider audience." },
    { title: "Get Comments", icon: MessageSquare, href: "/order/comments", description: "Spark conversations and make your content more interactive with relevant comments." },
    { title: "Get Views", icon: Eye, href: "/order/views", description: "Amplify your video's reach and improve its ranking with more views." },
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const typedDescription = useTypewriter(feature.description, 50, isOpen);

  return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
        <Card className="shadow-lg bg-card/10 backdrop-blur-lg border-border/20 hover:border-primary/80 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                 <feature.icon className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
              </div>
              <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                  </Button>
              </CollapsibleTrigger>
          </CardHeader>
          <CardContent>
              <CardDescription>Order new {feature.title.toLowerCase()} for your content.</CardDescription>
              <Button asChild className="w-full mt-4">
              <Link href={feature.href}>Proceed</Link>
              </Button>
          </CardContent>
          <CollapsibleContent>
            <div className="px-6 pb-4 text-sm text-muted-foreground min-h-[40px]">
                <p>{typedDescription}</p>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
  )
}


export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { wallet, orders } = useGlobalState();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <Skeleton className="h-screen w-full bg-transparent" />
      </div>
    );
  }
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Welcome, {user.displayName || user.email?.split("@")[0]}
          </h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-xl bg-card/60 backdrop-blur-lg border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{wallet.balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Available to spend</p>
            </CardContent>
          </Card>
          <Card className="shadow-xl bg-card/60 backdrop-blur-lg border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Across all services</p>
            </CardContent>
          </Card>
           <Card className="shadow-xl bg-card/60 backdrop-blur-lg border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Waiting for processing</p>
            </CardContent>
          </Card>
        </div>

        <div>
            <h2 className="text-xl font-semibold mb-4">What do you want to do today?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
