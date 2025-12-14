
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, ShieldCheck, TrendingUp, CircleHelp, Wallet, Package, ChevronDown, Send, Mail, User, HelpCircle } from 'lucide-react';
import { SplashScreen } from '@/components/splash-screen';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const faqData = [
    {
        question: "How do I use the services?",
        answer: "It's simple! From the Home page, choose a service like 'Get Followers' or 'Get Likes'. Click 'Proceed', enter the link to your content (like an Instagram post), choose the quantity you want, and place the order. Your wallet balance will be used for the payment.",
        icon: TrendingUp
    },
    {
        question: "Is my payment safe? Will funds be added to my wallet?",
        answer: "Yes, absolutely. We guarantee that 100% of your successfully paid funds will be added to your wallet. After you pay via UPI and submit the transaction ID, our team verifies it. Once approved, the amount is credited to your account. This is a secure and reliable process.",
        icon: ShieldCheck
    },
    {
        question: "How do I add funds to my wallet?",
        answer: "Go to the 'Wallet' page from the top-right menu and click 'Add Funds'. Scan the UPI QR code with your payment app. After the payment, enter the exact amount and the Transaction ID (TXN ID) from your payment app into the form and submit it. Your funds will be reflected in your wallet within 24 hours of verification.",
        icon: Wallet
    },
    {
        question: "What happens after I place an order?",
        answer: "After you place an order, its status is set to 'Pending'. Our team receives the order and begins processing it as quickly as possible. You can track the status of all your orders on the 'Your Orders' page. Once we complete the delivery, the status will change to 'Completed'.",
        icon: Package
    },
    {
        question: "What if I have a problem with an order or payment?",
        answer: "If you encounter any issues with an order not being completed or a fund request being incorrectly declined, please first check the relevant sections in this FAQ. If your issue is not resolved, you can use the contact form below to send a message to our support team.",
        icon: CircleHelp
    }
];

export default function SupportPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [user, loading, router]);
    
    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Your support request has been sent. We will get back to you shortly."
        });
        (e.target as HTMLFormElement).reset();
    }


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

          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20 mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about how the app works.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqData.map((item, index) => {
                         const Icon = item.icon;
                         return (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className='flex items-center gap-4 text-base'>
                                        <Icon className="h-5 w-5 text-primary" />
                                        <span>{item.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className='text-base pl-11'>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                         )
                    })}
                </Accordion>
            </CardContent>
          </Card>
          
           <Collapsible open={isContactOpen} onOpenChange={setIsContactOpen}>
                <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                    <CollapsibleTrigger asChild>
                         <CardHeader className='cursor-pointer'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-3'>
                                    <HelpCircle className="h-6 w-6 text-primary"/>
                                    <div>
                                        <CardTitle>Need More Help?</CardTitle>
                                        <CardDescription>Contact our support team directly.</CardDescription>
                                    </div>
                                </div>
                                <ChevronDown className={`h-6 w-6 text-muted-foreground transition-transform ${isContactOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <form onSubmit={handleSupportSubmit}>
                            <CardContent className="space-y-4 pt-4">
                                 <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="Your Name" defaultValue={user?.displayName || ''} required className="pl-10" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input type="email" placeholder="Your Email" defaultValue={user?.email || ''} required className="pl-10" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="subject" className="sr-only">Subject</Label>
                                    <Input id="subject" placeholder="Subject of your message" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="sr-only">Message</Label>
                                    <Textarea id="message" placeholder="Describe your issue in detail..." required rows={5} />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </CardContent>
                        </form>
                    </CollapsibleContent>
                </Card>
           </Collapsible>

        </div>
      </main>
    </div>
  );
}
