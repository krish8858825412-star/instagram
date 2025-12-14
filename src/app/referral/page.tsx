
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Copy, Check, Users, DollarSign, ExternalLink } from 'lucide-react';
import { useGlobalState } from '@/contexts/state-context';
import { SplashScreen } from '@/components/splash-screen';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ReferralPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { wallet, users, getReferredUsers, withdrawReferralEarnings } = useGlobalState();
  const { toast } = useToast();
  const currentUser = users.find(u => u.id === user?.uid);
  const referredUsers = user ? getReferredUsers(user.uid) : [];
  
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);
  
  const referralLink = currentUser ? `${origin}/?ref=${currentUser.referralCode}` : '';

  const handleCopyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Your referral link has been copied to the clipboard.",
    });
  };

  const handleWithdraw = () => {
      if(!user) return;
      withdrawReferralEarnings(user.uid);
      toast({
          title: "Success!",
          description: `₹${wallet.referralBalance.toFixed(2)} has been moved to your main wallet balance.`,
      })
  }

  if (loading || !user || !currentUser) {
    return <SplashScreen />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
            <p className="text-muted-foreground mt-2">Earn rewards by inviting your friends to the platform.</p>
          </div>

          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20 mb-8">
            <CardHeader>
              <CardTitle>How it Works</CardTitle>
              <CardDescription>
                Invite a friend with your unique referral link. When they sign up and add funds to their wallet, you'll earn a **7% commission** on the amount they add. This is a lifetime reward, so you'll earn from every deposit they make, forever!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Your Unique Referral Link</p>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                  <span className="text-lg font-mono tracking-widest flex-grow overflow-x-auto whitespace-nowrap no-scrollbar">{referralLink}</span>
                  <Button onClick={handleCopyToClipboard} size="icon" variant="ghost">
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className="text-3xl font-bold">₹{wallet.referralBalance.toFixed(2)}</div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button className="w-full" disabled={wallet.referralBalance <= 0}>Withdraw Earnings</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will move ₹{wallet.referralBalance.toFixed(2)} from your referral earnings to your main wallet balance. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleWithdraw}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
             <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Users Referred</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{referredUsers.length}</div>
                </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
              <CardHeader>
                  <CardTitle>Your Referred Users</CardTitle>
                  <CardDescription>Here is a list of users you have successfully referred.</CardDescription>
              </CardHeader>
              <CardContent>
                 {referredUsers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Registration Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {referredUsers.map(refUser => (
                                <TableRow key={refUser.id}>
                                    <TableCell>{refUser.name}</TableCell>
                                    <TableCell>{refUser.email}</TableCell>
                                    <TableCell>{new Date(refUser.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg bg-muted/20">
                        <Users className="h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">You haven't referred any users yet.</p>
                    </div>
                )}
              </CardContent>
          </Card>
          
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
          `}</style>

        </div>
      </main>
    </div>
  );
}
