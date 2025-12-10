'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Inbox as InboxIcon } from 'lucide-react';

export default function InboxPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Inbox</h1>
          <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Your notifications and messages will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/20">
                <InboxIcon className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Your inbox is empty.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
