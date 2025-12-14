
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LifeBuoy, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SplashScreen } from '@/components/splash-screen';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqData = [
    {
        question: "How do I add funds to my wallet?",
        answer: "Navigate to the 'Wallet' page from the user menu. Click on the 'Add Funds' button. You will see a QR code. Scan it with your UPI app to pay. After paying, enter the amount and the transaction ID into the form and submit your request. Funds will be credited within 24 hours after verification."
    },
    {
        question: "How do I get more followers, likes, comments, or views?",
        answer: "Go to the 'Home' page. You will see cards for 'Get Followers', 'Get Likes', 'Get Comments', and 'Get Views'. Click 'Proceed' on the service you want, enter your content link and the desired quantity, and then place the order. Make sure you have sufficient funds in your wallet."
    },
    {
        question: "How do I log in or log out?",
        answer: "The login page is the first page you see. To log out, click on your user avatar in the top-right corner of the header to open the menu, and then select 'Log out'."
    },
    {
        question: "I forgot my password. How do I reset it?",
        answer: "Unfortunately, an automatic password reset feature is not yet available. Please contact support using the form below, and we will assist you manually. We apologize for the inconvenience."
    },
    {
        question: "How long does it take for my order to be completed?",
        answer: "Orders are marked as 'Pending' initially. Our team will process them as quickly as possible. You can check the status of your orders on the 'Your Orders' page. Completion times can vary based on order size and type."
    }
]

export default function SupportPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
        router.replace("/");
        }
    }, [user, loading, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: 'Message Sent!',
            description: 'Our support team will get back to you shortly.',
        });
        const form = e.target as HTMLFormElement;
        form.reset();
        setIsFormVisible(false);
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
            <p className='text-muted-foreground mt-2'>Find answers to common questions or contact our team.</p>
          </div>

          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqData.map((faq, index) => (
                         <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className='text-base'>
                                {faq.answer}
                            </AccordionContent>
                         </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
          </Card>

          <div className='mt-8'>
             <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
                <CardHeader className='flex-row items-center justify-between'>
                    <div>
                        <CardTitle>Still Need Help?</CardTitle>
                        <CardDescription>If you can't find an answer, get in touch with us directly.</CardDescription>
                    </div>
                     <Button onClick={() => setIsFormVisible(!isFormVisible)}>
                        <Mail className='mr-2 h-4 w-4' />
                        {isFormVisible ? 'Close Form' : 'Contact Support'}
                    </Button>
                </CardHeader>
                {isFormVisible && (
                    <CardContent className='animation-focus-in'>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your Name" required defaultValue={user?.displayName || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="your@email.com" required defaultValue={user?.email || ''} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="How can we help?" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Describe your issue or question..." required rows={5} />
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </CardContent>
                )}
             </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
