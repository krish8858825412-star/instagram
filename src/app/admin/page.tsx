
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, ShoppingCart, Wallet, Banknote, History, MessageSquare, Settings, LifeBuoy, LayoutDashboard, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGlobalState } from '@/contexts/state-context';
import { AdminChart } from '@/components/admin-chart';

type AdminView = 'dashboard' | 'users' | 'orders' | 'wallets' | 'fund-requests' | 'withdrawals' | 'all-history' | 'inbox' | 'settings' | 'support';

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const router = useRouter();
  const { toast } = useToast();
  const { users, orders, wallets, fundRequests, withdrawalRequests, history, sendMessageToAll, qrCodeUrl, setQrCodeUrl, serviceLimits, setServiceLimits } = useGlobalState();

  const sortPendingFirst = (a: { status: string }, b: { status: string }) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  };

  const sortedOrders = [...orders].sort(sortPendingFirst);
  const sortedFundRequests = [...fundRequests].sort(sortPendingFirst);
  const sortedWithdrawalRequests = [...withdrawalRequests].sort(sortPendingFirst);

  const viewConfig = {
    dashboard: { title: 'Dashboard', icon: LayoutDashboard, description: 'View analytics', data: [], count: 0 },
    users: { title: 'Users', icon: Users, description: 'Manage all users', data: users, count: users.length },
    orders: { title: 'Orders', icon: ShoppingCart, description: 'Review new orders', data: sortedOrders, count: orders.filter(o => o.status === 'Pending').length },
    wallets: { title: 'Wallets', icon: Wallet, description: 'View user balances', data: wallets, count: wallets.length },
    'fund-requests': { title: 'Fund Requests', icon: Banknote, description: 'Approve fund requests', data: sortedFundRequests, count: fundRequests.filter(fr => fr.status === 'Pending').length },
    withdrawals: { title: 'Withdrawals', icon: Send, description: 'Process withdrawals', data: sortedWithdrawalRequests, count: withdrawalRequests.filter(wr => wr.status === 'Pending').length },
    'all-history': { title: 'All History', icon: History, description: 'View all system actions', data: history, count: history.length },
    inbox: { title: 'Inbox', icon: MessageSquare, description: 'Send messages to users', data: [], count: 0 },
    settings: { title: 'Settings', icon: Settings, description: 'Configure application', data: [], count: 0 },
    support: { title: 'Support', icon: LifeBuoy, description: 'View support tickets', data: [], count: 0 },
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    
    sendMessageToAll(subject, message);
    
    toast({
      title: 'Message Sent!',
      description: 'Your message has been sent to all users.',
    });
    form.reset();
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newQrCodeUrl = (form.elements.namedItem('qrCodeUrl') as HTMLInputElement).value;
    setQrCodeUrl(newQrCodeUrl);

    const newLimits = {
      followers: parseInt((form.elements.namedItem('followersLimit') as HTMLInputElement).value, 10) || 0,
      likes: parseInt((form.elements.namedItem('likesLimit') as HTMLInputElement).value, 10) || 0,
      comments: parseInt((form.elements.namedItem('commentsLimit') as HTMLInputElement).value, 10) || 0,
      views: parseInt((form.elements.namedItem('viewsLimit') as HTMLInputElement).value, 10) || 0,
    };
    setServiceLimits(newLimits);

    toast({
      title: 'Settings Saved!',
      description: 'The application settings have been updated.',
    });
  }

  const renderContent = () => {
    switch(currentView) {
        case 'dashboard':
            return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Analytics Dashboard</CardTitle>
                        <CardDescription>An overview of your application's activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <AdminChart users={users} orders={orders} />
                    </CardContent>
                </Card>
            );
        case 'users':
            return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                        <CardDescription>Manage all registered users. Click on a user to view their details.</CardDescription>
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
                            <TableRow 
                                key={user.id} 
                                onClick={() => router.push(`/admin/users/${user.id}`)}
                                className="cursor-pointer"
                            >
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.date).toLocaleDateString()}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        case 'orders':
            return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Order Management</CardTitle>
                        <CardDescription>Review incoming user orders. Pending orders are shown first.</CardDescription>
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
                            {viewConfig.orders.data.map((order) => (
                            <TableRow 
                                key={order.id} 
                                onClick={() => router.push(`/admin/orders/${order.id}`)} 
                                className={`cursor-pointer ${order.status !== 'Pending' ? 'bg-muted/30 text-muted-foreground' : ''}`}
                            >
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user}</TableCell>
                                <TableCell>{order.service}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>₹{order.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'Pending' ? 'outline' : 'secondary'}>{order.status}</Badge>
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
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
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
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Fund Requests</CardTitle>
                        <CardDescription>Approve or decline user requests to add funds. Pending requests are shown first.</CardDescription>
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
                                {viewConfig['fund-requests'].data.map((request) => (
                                    <TableRow 
                                        key={request.id} 
                                        onClick={() => router.push(`/admin/fund-requests/${request.id}`)} 
                                        className={`cursor-pointer ${request.status !== 'Pending' ? 'bg-muted/30 text-muted-foreground' : ''}`}
                                    >
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>{request.user}</TableCell>
                                        <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={request.status === 'Pending' ? 'outline' : 'secondary'}>{request.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        case 'withdrawals':
            return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Withdrawal Requests</CardTitle>
                        <CardDescription>Process user withdrawal requests. Pending requests are shown first.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {viewConfig.withdrawals.data.map((request) => (
                                    <TableRow 
                                        key={request.id} 
                                        // onClick={() => router.push(`/admin/withdrawals/${request.id}`)} 
                                        className={`cursor-pointer ${request.status !== 'Pending' ? 'bg-muted/30 text-muted-foreground' : ''}`}
                                    >
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>{request.user}</TableCell>
                                        <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                                        <TableCell>{request.method}</TableCell>
                                        <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={request.status === 'Pending' ? 'outline' : 'secondary'}>{request.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        case 'all-history':
            return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Action History</CardTitle>
                        <CardDescription>A log of all important actions taken in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Target ID</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((item, index) => (
                                <TableRow key={index} className="bg-muted/30 text-muted-foreground">
                                    <TableCell>{item.action}</TableCell>
                                    <TableCell>{item.target}</TableCell>
                                    <TableCell>{item.user}</TableCell>
                                    <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            );
        case 'inbox':
             return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Send a Message</CardTitle>
                        <CardDescription>Compose a message to be sent to all users' inboxes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleMessageSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" name="subject" placeholder="Message Subject" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" name="message" placeholder="Type your message here..." required rows={6} />
                            </div>
                            <Button type="submit">Send Message to All Users</Button>
                        </form>
                    </CardContent>
                </Card>
            );
        case 'settings':
            return (
               <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                   <CardHeader>
                       <CardTitle>Application Settings</CardTitle>
                       <CardDescription>Configure global settings for the application.</CardDescription>
                   </CardHeader>
                   <CardContent>
                       <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg">General Settings</h3>
                               <div className="space-y-2">
                                   <Label htmlFor="qrCodeUrl">UPI QR Code Image URL</Label>
                                   <Input 
                                     id="qrCodeUrl" 
                                     name="qrCodeUrl" 
                                     placeholder="https://example.com/qr-code.png" 
                                     defaultValue={qrCodeUrl}
                                     required 
                                   />
                                   <p className='text-xs text-muted-foreground'>
                                       Enter the direct URL to your QR code image. This will be shown to users on the Add Funds page.
                                   </p>
                               </div>
                            </div>

                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg">Daily Order Limits</h3>
                                <p className='text-sm text-muted-foreground'>
                                    Set the maximum number of orders that can be placed for each service per day. Set to 0 for unlimited.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="followersLimit">Followers Limit</Label>
                                        <Input id="followersLimit" name="followersLimit" type="number" defaultValue={serviceLimits.followers} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="likesLimit">Likes Limit</Label>
                                        <Input id="likesLimit" name="likesLimit" type="number" defaultValue={serviceLimits.likes} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="commentsLimit">Comments Limit</Label>
                                        <Input id="commentsLimit" name="commentsLimit" type="number" defaultValue={serviceLimits.comments} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="viewsLimit">Views Limit</Label>
                                        <Input id="viewsLimit" name="viewsLimit" type="number" defaultValue={serviceLimits.views} />
                                    </div>
                                </div>
                            </div>

                           <Button type="submit">Save Settings</Button>
                       </form>
                   </CardContent>
               </Card>
           );
        case 'support':
             return (
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CardHeader>
                        <CardTitle>Support Center</CardTitle>
                        <CardDescription>Manage user support tickets here. This feature is coming soon.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/20">
                            <LifeBuoy className="h-16 w-16 text-muted-foreground/50" />
                            <p className="mt-4 text-muted-foreground">Support ticket system is under construction.</p>
                        </div>
                    </CardContent>
                </Card>
            );
        default:
            return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-5">
            {(Object.keys(viewConfig) as AdminView[]).map((view) => {
                const Icon = viewConfig[view].icon;
                const isPendingView = view === 'orders' || view === 'fund-requests' || view === 'withdrawals';
                let count: number;

                if (['dashboard', 'settings', 'inbox', 'support'].includes(view)) {
                    count = viewConfig[view].count;
                } else if (isPendingView) {
                    count = viewConfig[view].count;
                } else {
                    count = viewConfig[view].data.length;
                }
                
                return (
                    <Card 
                        key={view}
                        className={`shadow-lg bg-card/60 backdrop-blur-lg border-border/20 cursor-pointer transition-all hover:border-primary ${currentView === view ? 'border-primary' : ''}`}
                        onClick={() => setCurrentView(view)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{viewConfig[view].title}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {view === 'dashboard' ? '' : count}
                                {isPendingView && count > 0 && <span className="text-sm font-normal text-muted-foreground"> pending</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">{viewConfig[view].description}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
        <div className="animation-focus-in">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}
