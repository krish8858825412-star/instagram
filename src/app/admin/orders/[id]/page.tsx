
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ArrowLeft, Check, X, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, you'd fetch this based on the ID
const mockOrder = {
  id: 'ORD001',
  user: 'John Doe',
  email: 'john@example.com',
  service: 'Followers',
  link: 'https://www.instagram.com/p/C-aaaaa-aaaa/',
  quantity: 100,
  price: 10.00,
  status: 'Pending',
  date: '2024-07-28',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id;

  // In a real app, you would fetch order details using the id
  const order = mockOrder;

  const handleAction = (action: 'approve' | 'decline') => {
    toast({
      title: `Order ${action === 'approve' ? 'Approved' : 'Declined'}`,
      description: `Order ID ${id} has been successfully ${action === 'approve' ? 'approved' : 'declined'}.`,
    });
    router.push('/admin');
  };
  
  const handleToast = (feature: string) => {
    toast({
        title: 'Feature not implemented',
        description: `The ${feature} functionality requires a backend and is not yet available.`,
    });
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Order Details</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleToast('Export')}>
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleToast('Delete History')}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete History
            </Button>
        </div>
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
                        <TableRow><TableCell className="font-semibold">Email</TableCell><TableCell>{order.email}</TableCell></TableRow>
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
