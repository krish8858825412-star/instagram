
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderPlacedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle: string;
  quantity: number;
  price: number;
}

export function OrderPlacedDialog({
  open,
  onOpenChange,
  serviceTitle,
  quantity,
  price,
}: OrderPlacedDialogProps) {
  const router = useRouter();

  const handleClose = () => {
    onOpenChange(false);
    router.push("/home");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="mt-4 text-2xl">Order Placed Successfully!</DialogTitle>
          <DialogDescription>
            Your order for {quantity.toLocaleString()} {serviceTitle.toLowerCase()} has been received.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="text-3xl font-bold">₹{price.toFixed(2)}</p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={handleClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
