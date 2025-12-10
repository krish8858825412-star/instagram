
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, PlusCircle } from 'lucide-react';
import { useGlobalState } from '@/contexts/state-context';
import { SplashScreen } from '@/components/splash-screen';
import Link from 'next/link';

export default function WalletPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { wallet } = useGlobalState();
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">My Wallet</h1>
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Current Balance</CardTitle>
                <CardDescription>Your available funds for placing orders.</CardDescription>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-5xl font-extrabold tracking-tighter text-primary">
                    ₹{wallet.balance.toFixed(2)}
                </div>
                <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href="/wallet/add-funds">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add Funds
                    </Link>
                </Button>
                <div className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
                    <div className="border rounded-lg p-4 text-center bg-muted/20">
                        <p className="text-muted-foreground">Transaction history will be shown here.</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
