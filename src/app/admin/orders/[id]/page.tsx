
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useGlobalState } from '@/contexts/state-context';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { orders, updateOrder, addHistoryItem } = useGlobalState();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
      const foundOrder = orders.find(o => o.id === id);
      if(foundOrder) {
          setOrder(foundOrder);
      }
  }, [id, orders]);


  const handleAction = (action: 'Completed' | 'Declined') => {
    if (!order) return;
    updateOrder(id, { status: action });
     addHistoryItem({
      action: `${action} Order`,
      target: id,
      user: 'Admin',
      date: new Date().toISOString(),
    });
    toast({
      title: `Order ${action}`,
      description: `Order ID ${id} has been successfully updated.`,
    });
    router.push('/admin');
  };
  
  if (!order) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 items-center justify-center">
            <p>Order not found.</p>
        </div>
    )
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Order Details</h1>
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <Card className="shadow-xl bg-card border-border/20">
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
              <CardDescription>
                Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow><TableCell className="font-semibold">User</TableCell><TableCell>{order.user}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Email</TableCell><TableCell>{/* user email */}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Service</TableCell><TableCell>{order.service}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Content Link</TableCell><TableCell><a href={order.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{order.link}</a></TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Quantity</TableCell><TableCell>{order.quantity.toLocaleString()}</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Price</TableCell><TableCell>₹{order.price.toFixed(2)}</TableCell></TableRow>
                         <TableRow><TableCell className="font-semibold">Status</TableCell><TableCell><Badge variant={order.status === 'Pending' ? 'outline' : 'default'}>{order.status}</Badge></TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end gap-2 p-4">
                <Button variant="destructive" onClick={() => handleAction('Declined')}>
                    <X className="mr-2 h-4 w-4" />
                    Decline
                </Button>
                <Button onClick={() => handleAction('Completed')}>
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
