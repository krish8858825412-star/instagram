'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

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

type AdminView = 'users' | 'orders' | 'wallets' | 'fund-requests';

export default function AdminPage() {
  
  const [currentView, setCurrentView] = useState<AdminView>('users');
  const router = useRouter();

  const renderContent = () => {
    switch(currentView) {
        case 'users':
            return (
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
            );
        case 'orders':
            return (
                <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Order Management</CardTitle>
                        <CardDescription>Review incoming user orders.</CardDescription>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                            <TableRow key={order.id} onClick={() => router.push(`/admin/orders/${order.id}`)} className="cursor-pointer">
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user}</TableCell>
                                <TableCell>{order.service}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.status}</Badge>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        case 'wallets':
            return (
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
            );
        case 'fund-requests':
            return (
                <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Fund Requests</CardTitle>
                        <CardDescription>Approve or decline user requests to add funds.</CardDescription>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fundRequests.map((request) => (
                                    <TableRow key={request.id} onClick={() => router.push(`/admin/fund-requests/${request.id}`)} className="cursor-pointer">
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>{request.user}</TableCell>
                                        <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                                        <TableCell>{request.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{request.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        default:
            return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="ml-auto">
            <Select value={currentView} onValueChange={(value) => setCurrentView(value as AdminView)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="wallets">Wallets</SelectItem>
                    <SelectItem value="fund-requests">Fund Requests</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
