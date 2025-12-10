
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LifeBuoy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SplashScreen } from '@/components/splash-screen';

export default function SupportPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

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
        // Here you would typically handle form submission
        const form = e.target as HTMLFormElement;
        form.reset();
    }

    if (loading || !user) {
        return <SplashScreen />;
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Support</h1>
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader className="text-center">
                <div className='flex justify-center items-center mb-4'>
                    <LifeBuoy className="h-12 w-12 text-primary" />
                </div>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Have a question or need help? Fill out the form below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
          </Card>
        </div>
      </main>
    </div>
  );
}
