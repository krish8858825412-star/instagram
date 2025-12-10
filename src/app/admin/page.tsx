'use client';

import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-lg md:px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Welcome, Administrator
          </h1>
        </div>
        <Separator />
        <div className="grid gap-4 md:gap-8">
          <Card className="shadow-xl bg-transparent backdrop-blur-lg border-border/20 relative overflow-hidden">
            <AnimatedBackground />
            <div className="relative z-10">
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is your admin dashboard. You can manage your application from here.</p>
              </CardContent>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
