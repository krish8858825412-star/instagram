
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGlobalState } from '@/contexts/state-context';
import { useToast } from '@/hooks/use-toast';
import { SplashScreen } from '@/components/splash-screen';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AddFundsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addFundRequest, updateFundRequest, addHistoryItem, qrCodeUrl } = useGlobalState();
  const { toast } = useToast();

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!user) return;
    if(!amount || !transactionId) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please enter both the amount and transaction ID."
        });
        return;
    }
    
    setIsSubmitting(true);

    setTimeout(() => {
        const generateUniqueId = (prefix: string) => {
            const timestamp = Date.now().toString(36);
            const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            return `${prefix}${timestamp}${randomPart}`.substring(0, 30).toUpperCase();
        };

        const newRequestId = generateUniqueId('FUND-');
        const newRequest = {
            id: newRequestId,
            user: user?.displayName || 'Unknown User',
            userId: user.uid,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
            status: 'Pending' as 'Pending' | 'Approved' | 'Declined',
            paymentMethod: 'UPI',
            transactionId: transactionId,
        };
        addFundRequest(newRequest);
        addHistoryItem({
            action: 'Created Fund Request',
            target: newRequest.id,
            user: newRequest.user,
            date: new Date().toISOString(),
        });
        
        // Auto-approve the request
        updateFundRequest(newRequestId, { status: 'Approved' });

        toast({
            title: 'Funds Added!',
            description: `₹${parseFloat(amount).toFixed(2)} has been successfully added to your wallet.`
        });
        
        setIsSubmitting(false);
        router.push('/wallet');

    }, 1500)
  }

  if (loading || !user) {
    return <SplashScreen />;
  }
  
  const displayQrCode = qrCodeUrl || "https://placehold.co/250x250/000000/FFFFFF?text=Scan+Me";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-2xl">
           <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Wallet
            </Button>
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
              <CardDescription>Scan the QR code to pay, then submit the details below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
                    <Image src={displayQrCode} alt="UPI QR Code" width={250} height={250} className='rounded-md border-4 border-white shadow-lg' data-ai-hint="qr code" />
                </div>
                
                <Alert>
                    <AlertTitle>Important!</AlertTitle>
                    <AlertDescription>
                        After paying, enter the exact amount and the transaction ID (TXN ID) from your payment app. Your funds will be added instantly.
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount Paid (₹)</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            placeholder="e.g., 500" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="transactionId">Transaction ID (TXN ID)</Label>
                        <Input 
                            id="transactionId" 
                            type="text" 
                            placeholder="Enter the full transaction ID" 
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Submitting...' : 'Submit & Add Funds'}
                    </Button>
                </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
