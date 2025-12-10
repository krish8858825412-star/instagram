
"use client";

import { useState } from "react";
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
import { ArrowLeft, CheckCircle, Link as LinkIcon, Loader2 } from "lucide-react";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { OrderPlacedDialog } from "@/components/order-placed-dialog";

const serviceDetails: { [key: string]: { title: string; unit: string; step: number } } = {
  followers: { title: "Followers", unit: "followers", step: 10 },
  likes: { title: "Likes", unit: "likes", step: 100 },
  comments: { title: "Comments", unit: "comments", step: 5 },
  views: { title: "Views", unit: "views", step: 1000 },
};

const PRICE_PER_10_UNITS = 1; // 1 Rupee per 10 units

export default function ServiceOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const service = Array.isArray(params.service) ? params.service[0] : params.service;
  const details = serviceDetails[service] || { title: "Service", unit: "items", step: 10 };

  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(details.step);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');


  const price = (quantity / 10) * PRICE_PER_10_UNITS;

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
    if(previewUrl) setPreviewUrl(''); // Reset preview if link changes
  }

  const handlePreview = () => {
    if(!link.startsWith('http')) {
        toast({
            variant: 'destructive',
            title: 'Invalid Link',
            description: 'Please enter a valid URL starting with http or https.',
        });
        return;
    }
    setIsPreviewing(true);
    // Simulate fetching preview. In a real app, this would fetch metadata from the link.
    // This is a complex task often requiring a backend service to avoid CORS issues.
    setTimeout(() => {
        setPreviewUrl('https://picsum.photos/seed/instapreview/600/400');
        setIsPreviewing(false);
    }, 1500);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      toast({
        variant: "destructive",
        title: "No Preview",
        description: "Please generate a preview before placing an order.",
      });
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call for placing an order
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
    }, 2000);
  };
  
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
                      <Button type="button" onClick={handlePreview} disabled={isPreviewing || !link}>
                        {isPreviewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                        Preview
                      </Button>
                    </div>
                  </div>

                  {previewUrl && (
                    <div className="space-y-2 animation-focus-in">
                        <Label>Content Preview</Label>
                        <div className="rounded-lg overflow-hidden border border-border/20 aspect-video relative bg-muted flex items-center justify-center">
                            <Image src={previewUrl} alt="Content Preview" layout="fill" objectFit="cover" data-ai-hint="social media post" />
                            <p className="z-10 text-white bg-black/50 p-2 rounded-md">Live preview is for demonstration</p>
                        </div>
                    </div>
                  )}

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
                        Minimum order is {details.step} {details.unit}.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-3xl font-bold">
                      ₹{price.toFixed(2)}
                    </span>
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting || !previewUrl}>
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
