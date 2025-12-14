
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Info, ShieldCheck, TrendingUp, CircleHelp, Wallet, Package } from 'lucide-react';
import { SplashScreen } from '@/components/splash-screen';

const aboutData = [
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
        answer: "If you encounter any issues with an order not being completed or a fund request being incorrectly declined, please do not hesitate to reach out. While we don't have a direct contact form on this page, you can create a new account with a different email and use the login details to signal our support team.",
        icon: CircleHelp
    }
]

export default function AboutPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
        router.replace("/");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <SplashScreen />;
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <div className='text-center mb-8'>
            <Info className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">About Our App</h1>
            <p className='text-muted-foreground mt-2'>Your guide to understanding our services, features, and guarantees.</p>
          </div>

          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>App Guide & Information</CardTitle>
              <CardDescription>Find answers to all your questions about how the app works.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {aboutData.map((item, index) => {
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
        </div>
      </main>
    </div>
  );
}
