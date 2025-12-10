
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, ClipboardPaste, Info, Loader2, Wallet, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderPlacedDialog } from "@/components/order-placed-dialog";
import { useGlobalState } from "@/contexts/state-context";
import { useAuth } from "@/hooks/use-auth";
import { SplashScreen } from "@/components/splash-screen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const serviceDetails: { [key: string]: { title: string; unit: string; step: number } } = {
  followers: { title: "Followers", unit: "followers", step: 10 },
  likes: { title: "Likes", unit: "likes", step: 100 },
  comments: { title: "Comments", unit: "comments", step: 10 },
  views: { title: "Views", unit: "views", step: 1000 },
};

const PRICE_PER_10_UNITS = 1; // 1 Rupee per 10 units

export default function ServiceOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { wallet, addOrder, addHistoryItem, serviceLimits, getTodaysOrderCount } = useGlobalState();
  const service = Array.isArray(params.service) ? params.service[0] : params.service;
  const details = serviceDetails[service] || { title: "Service", unit: "items", step: 10 };

  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(details.step);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);
  
  const todaysOrders = getTodaysOrderCount(details.title);
  const dailyLimit = serviceLimits[details.title.toLowerCase() as keyof typeof serviceLimits] || 0;
  const isLimitReached = dailyLimit > 0 && todaysOrders >= dailyLimit;
  const remainingOrders = dailyLimit > 0 ? dailyLimit - todaysOrders : Infinity;


  const price = (quantity / 10) * PRICE_PER_10_UNITS;
  const hasSufficientFunds = wallet.balance >= price;

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  }
  
  const handlePaste = async () => {
    try {
        const text = await navigator.clipboard.readText();
        setLink(text);
        toast({
            title: 'Pasted!',
            description: 'Link pasted from clipboard.'
        })
    } catch(err) {
        toast({
            variant: 'destructive',
            title: 'Failed to paste',
            description: 'Could not read from clipboard. Please check your browser permissions.'
        })
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      toast({
        variant: "destructive",
        title: "Daily Limit Reached",
        description: `The daily order limit for ${details.title} has been reached. Please try again tomorrow.`,
      });
      return;
    }
    if (!link) {
      toast({
        variant: "destructive",
        title: "No Link Provided",
        description: "Please enter a link to your content.",
      });
      return;
    }
    if (!hasSufficientFunds) {
       toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "You do not have enough money in your wallet to place this order.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newOrder = {
        id: `ORD${String(Date.now()).slice(-4)}`,
        user: user?.displayName || 'Unknown User',
        service: details.title,
        link,
        quantity,
        price,
        status: 'Pending' as 'Pending',
        date: new Date().toISOString(),
      };
      addOrder(newOrder);
      addHistoryItem({
        action: `Placed Order`,
        target: newOrder.id,
        user: newOrder.user,
        date: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setShowSuccessDialog(true);
    }, 2000);
  };

  if (loading || !user) {
    return <SplashScreen />;
  }
  
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
          <div className="w-full max-w-2xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Card className="shadow-xl bg-card/10 backdrop-blur-lg border-border/20">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    Get more {details.title}
                  </CardTitle>
                  <CardDescription>
                    Enter the link to your content and choose how many {details.unit} you want.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                 {isLimitReached ? (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Daily Limit Reached</AlertTitle>
                      <AlertDescription>
                        The maximum number of orders for {details.title} for today has been reached. Please check back tomorrow.
                      </AlertDescription>
                    </Alert>
                  ) : dailyLimit > 0 && (
                     <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Daily Orders Remaining</AlertTitle>
                      <AlertDescription>
                        You can place {remainingOrders.toLocaleString()} more order(s) for {details.title} today. ({todaysOrders}/{dailyLimit} used).
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="link">Content Link</Label>
                    <div className="flex gap-2">
                      <Input
                        id="link"
                        placeholder="https://www.instagram.com/p/..."
                        value={link}
                        onChange={handleLinkChange}
                        required
                        className="flex-grow"
                      />
                      <Button type="button" onClick={handlePaste}>
                        <ClipboardPaste className="mr-2 h-4 w-4" />
                        Paste
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      min={details.step}
                      step={details.step}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                        Minimum order is {details.step} {details.unit} (for ₹{((details.step / 10) * PRICE_PER_10_UNITS).toFixed(2)}).
                    </p>
                  </div>
                   <Card className="bg-muted/50 border-dashed">
                    <CardHeader className="flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Your Balance</span>
                      </div>
                      <span className={`text-lg font-bold ${hasSufficientFunds ? 'text-green-500' : 'text-destructive'}`}>₹{wallet.balance.toFixed(2)}</span>
                    </CardHeader>
                  </Card>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-3xl font-bold">
                      ₹{price.toFixed(2)}
                    </span>
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting || !link || !hasSufficientFunds || isLimitReached}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
      <OrderPlacedDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        serviceTitle={details.title}
        quantity={quantity}
        price={price}
      />
    </>
  );
}
