
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LifeBuoy, ShieldCheck, TrendingUp, Wallet, Package, Send, Bot, User, HelpCircle } from 'lucide-react';
import { SplashScreen } from '@/components/splash-screen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTypewriter } from '@/hooks/use-typewriter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const faqData = [
    {
        id: "how-to-use",
        question: "How do I use the services?",
        answer: "It's simple! From the Home page, choose a service like 'Get Followers' or 'Get Likes'. Click 'Proceed', enter the link to your content (like an Instagram post), choose the quantity you want, and place the order. Your wallet balance will be used for the payment.",
        icon: TrendingUp
    },
    {
        id: "is-safe",
        question: "Is my payment safe?",
        answer: "Yes, absolutely. We guarantee that 100% of your successfully paid funds will be added to your wallet. After you pay via UPI and submit the transaction ID, our team verifies it. Once approved, the amount is credited to your account. This is a secure and reliable process.",
        icon: ShieldCheck
    },
    {
        id: "add-funds",
        question: "How do I add funds to my wallet?",
        answer: "Go to the 'Wallet' page from the top-right menu and click 'Add Funds'. Scan the UPI QR code with your payment app. After the payment, enter the exact amount and the Transaction ID (TXN ID) from your payment app into the form and submit it. Your funds will be reflected in your wallet within 24 hours of verification.",
        icon: Wallet
    },
    {
        id: "after-order",
        question: "What happens after I place an order?",
        answer: "After you place an order, its status is set to 'Pending'. Our team receives the order and begins processing it as quickly as possible. You can track the status of all your orders on the 'Your Orders' page. Once we complete the delivery, the status will change to 'Completed'.",
        icon: Package
    },
];

type Message = {
    id: string;
    type: 'bot' | 'user' | 'options';
    text?: string;
    options?: typeof faqData;
    isTyping?: boolean;
}

const BotMessage = ({ content }: { content: string }) => {
    const typedContent = useTypewriter(content, 30);
    return <p>{typedContent}</p>;
};


export default function SupportPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const [messages, setMessages] = useState<Message[]>([
        {
            id: `msg-${Date.now()}-1`,
            type: 'bot',
            text: "Hello! I'm here to help. Please select one of the common questions below, or open a support ticket if you need more assistance.",
            isTyping: true,
        },
        {
            id: `msg-${Date.now()}-2`,
            type: 'options',
            options: faqData
        }
    ]);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleQuestionSelect = (faqItem: typeof faqData[0]) => {
        setMessages(prev => {
            const filteredPrev = prev.filter(p => p.type !== 'options');
            return [
                ...filteredPrev,
                { id: `msg-${Date.now()}-q`, type: 'user', text: faqItem.question },
                { id: `msg-${Date.now()}-a`, type: 'bot', text: faqItem.answer, isTyping: true },
                { id: `msg-${Date.now()}-o`, type: 'options', options: faqData }
            ];
        });
    };
    
    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Your support request has been sent. We will get back to you shortly."
        });
        (e.target as HTMLFormElement).reset();
    };

    if (loading || !user) {
        return <SplashScreen />;
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <div className='text-center mb-8'>
            <LifeBuoy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
            <p className='text-muted-foreground mt-2'>Find answers to your questions or contact our team.</p>
          </div>

          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Support Chat</CardTitle>
              <CardDescription>Get instant answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-lg border">
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.type === 'bot' && (
                                <div className="flex items-end gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="max-w-[75%] rounded-lg bg-background p-3 text-sm shadow-md">
                                        {msg.text && msg.isTyping ? <BotMessage content={msg.text} /> : msg.text}
                                    </div>
                                </div>
                            )}
                            {msg.type === 'user' && (
                                <div className="flex items-end gap-2 justify-end">
                                     <div className="max-w-[75%] rounded-lg bg-primary text-primary-foreground p-3 text-sm shadow-md">
                                        {msg.text}
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                        <User className="h-5 w-5" />
                                    </div>
                                </div>
                            )}
                            {msg.type === 'options' && (
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {msg.options?.map(item => (
                                        <Button 
                                            key={item.id} 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleQuestionSelect(item)}
                                            className="bg-background/50 backdrop-blur-sm"
                                        >
                                            {item.question}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                 <div className="mt-6 text-center">
                    <p className="text-muted-foreground mb-2">Can't find your answer?</p>
                     <Dialog>
                        <DialogTrigger asChild>
                           <Button>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Open a Support Ticket
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Contact Support</DialogTitle>
                                <DialogDescription>
                                    Describe your issue in detail and our team will get back to you as soon as possible.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSupportSubmit} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="Your Name" defaultValue={user?.displayName || ''} required className="pl-10" />
                                </div>
                                <div className="relative">
                                    <Input id="subject" placeholder="Subject of your message" required />
                                </div>
                                <div className="space-y-2">
                                    <Textarea id="message" placeholder="Please describe your issue..." required rows={5} />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
