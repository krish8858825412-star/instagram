'use client';

import { AnimatedBackground } from '@/components/animated-background';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

// Mock data
const users = [
  { id: 'USR001', name: 'John Doe', email: 'john@example.com', date: '2024-07-28' },
  { id: 'USR002', name: 'Jane Smith', email: 'jane@example.com', date: '2024-07-29' },
];

const orders = [
  { id: 'ORD001', user: 'John Doe', service: 'Followers', quantity: 100, price: 10.00, status: 'Pending' },
  { id: 'ORD002', user: 'Jane Smith', service: 'Likes', quantity: 500, price: 50.00, status: 'Pending' },
];

const wallets = [
  { userId: 'USR001', name: 'John Doe', balance: 150.00 },
  { userId: 'USR002', name: 'Jane Smith', balance: 75.50 },
];

const fundRequests = [
    { id: 'FUND001', user: 'John Doe', amount: 500, date: '2024-07-30', status: 'Pending' },
    { id: 'FUND002', user: 'Jane Smith', amount: 200, date: '2024-07-30', status: 'Pending' },
]

export default function AdminPage() {
  
  // Mock action handlers
  const handleOrderAction = (orderId: string, action: 'approve' | 'decline') => {
    alert(`Order ${orderId} has been ${action}d.`);
  };

  const handleFundRequestAction = (requestId: string, action: 'approve' | 'decline') => {
    alert(`Fund Request ${requestId} has been ${action}d.`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="fund-requests">Fund Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20">
              <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>Manage all registered users.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Approve or decline incoming user orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.user}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>₹{order.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.status}</Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                           <Button size="icon" variant="outline" className="text-green-500 hover:text-green-600 border-green-500/50 hover:border-green-500" onClick={() => handleOrderAction(order.id, 'approve')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="text-red-500 hover:text-red-600 border-red-500/50 hover:border-red-500" onClick={() => handleOrderAction(order.id, 'decline')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallets">
            <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20">
              <CardHeader>
                <CardTitle>User Wallets</CardTitle>
                <CardDescription>View the current balance of all users.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallets.map((wallet) => (
                      <TableRow key={wallet.userId}>
                        <TableCell>{wallet.userId}</TableCell>
                        <TableCell>{wallet.name}</TableCell>
                        <TableCell>₹{wallet.balance.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fund-requests">
             <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20">
                <CardHeader>
                    <CardTitle>Fund Requests</CardTitle>
                    <CardDescription>Approve or decline user requests to add funds to their wallet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fundRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.user}</TableCell>
                                    <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                                    <TableCell>{request.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{request.status}</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="icon" variant="outline" className="text-green-500 hover:text-green-600 border-green-500/50 hover:border-green-500" onClick={() => handleFundRequestAction(request.id, 'approve')}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="text-red-500 hover:text-red-600 border-red-500/50 hover:border-red-500" onClick={() => handleFundRequestAction(request.id, 'decline')}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
