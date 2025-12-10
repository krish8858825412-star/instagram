'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Inbox as InboxIcon, Mail, Trash2 } from 'lucide-react';
import { useGlobalState } from '@/contexts/state-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function InboxPage() {
  const { messages, clearInbox } = useGlobalState();
  const { toast } = useToast();

  const handleDeleteAll = () => {
    clearInbox();
    toast({
        title: "Inbox Cleared",
        description: "All your messages have been deleted."
    });
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
            {messages.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Messages
              </Button>
            )}
          </div>
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Your notifications and messages will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {messages.map((msg) => (
                    <AccordionItem value={`item-${msg.id}`} key={msg.id}>
                      <AccordionTrigger>
                        <div className='flex items-center gap-4'>
                           <Mail className='h-5 w-5 text-muted-foreground' />
                           <span className='font-semibold'>{msg.subject}</span>
                           <Badge variant="secondary">{new Date(msg.date).toLocaleDateString()}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='pl-10'>
                        <p>{msg.message}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/20">
                  <InboxIcon className="h-16 w-16 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Your inbox is empty.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
