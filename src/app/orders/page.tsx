'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

// Mock data for orders
const orders = [
  {
    id: 'ORD001',
    service: 'Followers',
    quantity: 100,
    price: 10.00,
    status: 'Completed',
    date: '2024-07-28',
  },
  {
    id: 'ORD002',
    service: 'Likes',
    quantity: 500,
    price: 50.00,
    status: 'In Progress',
    date: '2024-07-29',
  },
  {
    id: 'ORD003',
    service: 'Views',
    quantity: 10000,
    price: 100.00,
    status: 'Pending',
    date: '2024-07-30',
  },
];

export default function OrdersPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Pending':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Your Orders</h1>
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Here is a list of your recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>{order.quantity.toLocaleString()}</TableCell>
                        <TableCell>₹{order.price.toFixed(2)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/20">
                    <Package className="h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">You haven't placed any orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
