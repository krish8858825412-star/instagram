
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';
import { useGlobalState } from '@/contexts/state-context';
import { SplashScreen } from '@/components/splash-screen';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function WalletPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { wallet, history } = useGlobalState();
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return <SplashScreen />;
  }

  const walletHistory = history.filter(item => 
    item.user === (user?.displayName || 'User') && (item.action === 'Added Funds' || item.action === 'Placed Order')
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
                     {walletHistory.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {walletHistory.map((item, index) => {
                            const isCredit = item.action === 'Added Funds';
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                    <Badge variant={isCredit ? 'default' : 'secondary'} className={isCredit ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}>
                                    {isCredit ? <PlusCircle className='mr-2' /> : <MinusCircle className='mr-2' />}
                                    {isCredit ? 'Credit' : 'Debit'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{item.action}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {isCredit ? `Fund Request Approved` : `Order ID: ${item.target}`}
                                  </div>
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
                                  {isCredit ? '+' : '-'} {item.action === 'Placed Order' ? `₹${(wallet.balance - (wallet.balance + parseFloat(item.target.replace('₹','')))).toFixed(2)}` : item.target }
                                </TableCell>
                                <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="border rounded-lg p-8 text-center bg-muted/20">
                          <p className="text-muted-foreground">Your transaction history will appear here.</p>
                      </div>
                    )}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
