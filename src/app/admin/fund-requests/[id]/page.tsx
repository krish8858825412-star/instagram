
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useGlobalState } from '@/contexts/state-context';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FundRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { fundRequests, updateFundRequest, addHistoryItem } = useGlobalState();
  const id = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  useEffect(() => {
    const foundRequest = fundRequests.find((r) => r.id === id);
    if (foundRequest) {
      setRequest(foundRequest);
      setCustomAmount(String(foundRequest.amount));
    }
  }, [id, fundRequests]);


  const handleAction = (action: 'Approved' | 'Declined') => {
    if (!request) return;
    
    let approvedAmount: number | undefined = undefined;
    if (action === 'Approved') {
        const customAmountNumber = parseFloat(customAmount);
        if(!isNaN(customAmountNumber) && customAmountNumber > 0) {
            approvedAmount = customAmountNumber;
        } else {
             toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a valid positive number for the amount.',
            });
            return;
        }
    }

    updateFundRequest(id, { status: action }, approvedAmount);

     addHistoryItem({
      action: `${action} Fund Request`,
      target: id,
      user: 'Admin',
      date: new Date().toISOString(),
    });
    toast({
      title: `Fund Request ${action}`,
      description: `Request ID ${id} has been successfully ${action.toLowerCase()}.`,
    });
    router.push('/admin');
  };

  if (!request) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-transparent items-center justify-center">
            <p>Request not found.</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Fund Request Details</h1>
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Fund Request #{request.id}</CardTitle>
              <CardDescription>
                Requested on {new Date(request.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Table>
                    <TableBody>
                        <TableRow><TableCell className="font-semibold">User</TableCell><TableCell>{request.user}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Email</TableCell><TableCell>{/* Add email if available */}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Requested Amount</TableCell><TableCell>₹{request.amount.toFixed(2)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Payment Method</TableCell><TableCell>{request.paymentMethod || 'N/A'}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Transaction ID</TableCell><TableCell>{request.transactionId || 'N/A'}</TableCell></TableRow>
                         <TableRow><TableCell className="font-semibold">Status</TableCell><TableCell>{request.status}</TableCell></TableRow>
                    </TableBody>
                </Table>
                
                {request.status === 'Pending' && (
                    <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor="customAmount">Custom Approval Amount (₹)</Label>
                        <Input
                            id="customAmount"
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Enter amount to approve"
                        />
                         <p className="text-xs text-muted-foreground">
                            Leave this field with the requested amount or change it to approve a different amount.
                        </p>
                    </div>
                )}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end gap-2 p-4">
               {request.status === 'Pending' && (
                 <>
                    <Button variant="destructive" onClick={() => handleAction('Declined')}>
                        <X className="mr-2 h-4 w-4" />
                        Decline
                    </Button>
                    <Button onClick={() => handleAction('Approved')}>
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                    </Button>
                 </>
               )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
