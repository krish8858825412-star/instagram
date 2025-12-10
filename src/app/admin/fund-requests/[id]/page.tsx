
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Mock data - in a real app, you'd fetch this based on the ID
const mockRequest = {
  id: 'FUND001',
  user: 'John Doe',
  email: 'john@example.com',
  amount: 500.00,
  status: 'Pending',
  date: '2024-07-30',
  paymentMethod: 'UPI',
  transactionId: 'abcdef123456',
};

export default function FundRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id;

  // In a real app, you would fetch request details using the id
  const request = mockRequest;

  const handleAction = (action: 'approve' | 'decline') => {
    toast({
      title: `Fund Request ${action === 'approve' ? 'Approved' : 'Declined'}`,
      description: `Request ID ${id} has been successfully ${action === 'approve' ? 'approved' : 'declined'}.`,
    });
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Fund Request Details</h1>
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <Card className="shadow-xl bg-card border-border/20">
            <CardHeader>
              <CardTitle>Fund Request #{request.id}</CardTitle>
              <CardDescription>
                Requested on {new Date(request.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow><TableCell className="font-semibold">User</TableCell><TableCell>{request.user}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Email</TableCell><TableCell>{request.email}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Amount</TableCell><TableCell>₹{request.amount.toFixed(2)}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Payment Method</TableCell><TableCell>{request.paymentMethod}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Transaction ID</TableCell><TableCell>{request.transactionId}</TableCell></TableRow>
                         <TableRow><TableCell className="font-semibold">Status</TableCell><TableCell>{request.status}</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end gap-2 p-4">
                <Button variant="destructive" onClick={() => handleAction('decline')}>
                    <X className="mr-2 h-4 w-4" />
                    Decline
                </Button>
                <Button onClick={() => handleAction('approve')}>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
