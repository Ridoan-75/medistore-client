"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useAppSelector } from "@/src/store/hooks";
import {
  selectCartSubtotal,
  selectCartTotalQuantity,
} from "@/src/store/slices/cartSlice";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  ArrowRight,
  Package,
  Tag,
} from "lucide-react";

interface SummaryItem {
  label: string;
  value: string;
  icon?: typeof Package;
  highlight?: boolean;
}

interface Feature {
  icon: typeof Truck;
  text: string;
}

const FEATURES: Feature[] = [
  { icon: Truck, text: "Free shipping over ৳500" },
  { icon: Shield, text: "Secure payment" },
];

const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

export function CartSummary() {
  const subtotal = useAppSelector(selectCartSubtotal);
  const totalItems = useAppSelector(selectCartTotalQuantity);

  const isCartEmpty = totalItems === 0;
  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const hasFreeShipping = subtotal >= freeShippingThreshold;

  const summaryItems: SummaryItem[] = [
    {
      label: `Subtotal (${totalItems} ${totalItems === 1 ? "item" : "items"})`,
      value: formatCurrency(subtotal),
      icon: Package,
    },
    {
      label: "Shipping",
      value: hasFreeShipping ? "FREE" : "Calculated at checkout",
      icon: Truck,
    },
  ];

  return (
    <Card className="border-2 shadow-sm sticky top-24">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {!hasFreeShipping && subtotal > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">Almost there!</span>
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
              Add {formatCurrency(remainingForFreeShipping)} more to get{" "}
              <span className="font-semibold">FREE shipping</span>
            </p>
            <div className="mt-3 h-2 bg-amber-500/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
              />
            </div>
          </div>
        )}

        {hasFreeShipping && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-green-600 dark:text-green-400">
                Free Shipping Unlocked!
              </p>
              <p className="text-xs text-green-600/80 dark:text-green-400/80">
                Your order qualifies for free delivery
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </div>
                <span
                  className={`font-medium ${
                    item.value === "FREE"
                      ? "text-green-600 dark:text-green-400"
                      : "text-foreground"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t-2 border-dashed border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            Tax included where applicable
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            asChild
            disabled={isCartEmpty}
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 font-semibold text-base"
          >
            <Link href="/checkout">
              <CreditCard className="h-5 w-5 mr-2" />
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-11 border-2 font-medium"
          >
            <Link href="/shop">
              <Package className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.text}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{feature.text}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}