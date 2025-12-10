
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Wallet, ShoppingCart, Banknote, History, User } from 'lucide-react';
import { useGlobalState } from '@/contexts/state-context';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getUserData } = useGlobalState();
  const id = params.id as string;

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const data = getUserData(id);
      setUserData(data);
    }
  }, [id, getUserData]);

  if (!userData || !userData.user) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 items-center justify-center">
            <p>User not found.</p>
        </div>
    )
  }

  const { user, wallet, userOrders, userFundRequests, userHistory } = userData;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Declined':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-bold">User Details</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-xl bg-card border-border/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">User Information</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Joined: {new Date(user.date).toLocaleDateString()}</p>
                </CardContent>
            </Card>
             <Card className="shadow-xl bg-card border-border/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{wallet?.balance.toFixed(2) || '0.00'}</div>
                    <p className="text-xs text-muted-foreground">Current available funds</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-8">
            <Card className="shadow-xl bg-card border-border/20">
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Order History</CardTitle>
                    </div>
                    <CardDescription>All orders placed by this user.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {userOrders.length > 0 ? userOrders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.service}</TableCell>
                                    <TableCell>{order.quantity.toLocaleString()}</TableCell>
                                    <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={6} className="text-center">No orders found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="shadow-xl bg-card border-border/20">
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Fund Request History</CardTitle>
                    </div>
                    <CardDescription>All fund requests made by this user.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userFundRequests.length > 0 ? userFundRequests.map((req: any) => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.id}</TableCell>
                                    <TableCell>₹{req.amount.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center">No fund requests found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Card className="shadow-xl bg-card border-border/20">
                <CardHeader>
                     <div className='flex items-center gap-2'>
                        <History className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>User Action History</CardTitle>
                    </div>
                    <CardDescription>Log of all actions performed by this user.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Target ID</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userHistory.length > 0 ? userHistory.map((item: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{item.action}</TableCell>
                                    <TableCell>{item.target}</TableCell>
                                    <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={3} className="text-center">No history found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

