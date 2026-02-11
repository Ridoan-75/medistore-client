"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackOrderStatusAction } from "@/src/actions/order.action";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Order } from "@/src/services/order.service";
import {
  Package,
  ChevronRight,
  Search,
  Loader2,
  Check,
  XCircle,
  Truck,
  Clock,
  PackageCheck,
  Box,
  MapPin,
  ArrowLeft,
  RefreshCw,
  LucideIcon,
} from "lucide-react";

type OrderStatus = Order["status"];
type StepState = "completed" | "current" | "pending";

interface OrderStep {
  status: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const ORDER_STEPS: OrderStep[] = [
  {
    status: "PLACED",
    label: "Order Placed",
    icon: Clock,
    description: "Your order has been received",
  },
  {
    status: "PROCESSING",
    label: "Processing",
    icon: Box,
    description: "Preparing your items",
  },
  {
    status: "SHIPPED",
    label: "Shipped",
    icon: Truck,
    description: "On the way to you",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
    icon: PackageCheck,
    description: "Order completed",
  },
];

const STATUS_ORDER = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const getStepState = (
  stepStatus: string,
  currentStatus: OrderStatus | null,
): StepState => {
  if (!currentStatus || currentStatus === "CANCELLED") return "pending";

  const currentIndex = STATUS_ORDER.indexOf(
    currentStatus as (typeof STATUS_ORDER)[number],
  );
  const stepIndex = STATUS_ORDER.indexOf(
    stepStatus as (typeof STATUS_ORDER)[number],
  );

  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "pending";
};

const getStatusBadgeVariant = (
  status: OrderStatus,
): "default" | "destructive" | "secondary" => {
  if (status === "DELIVERED") return "default";
  if (status === "CANCELLED") return "destructive";
  return "secondary";
};

export default function OrderTrackPage() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = useCallback(async (id: string) => {
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    setStatus(null);

    const result = await trackOrderStatusAction(id.trim());

    if (result.error) {
      setError(result.error.message);
    } else if (result.data) {
      setStatus(result.data.status);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setOrderId(orderIdParam);
      trackOrder(orderIdParam);
    }
  }, [searchParams, trackOrder]);

  const handleTrackOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trackOrder(orderId);
  };

  const handleRefresh = () => {
    if (orderId.trim()) {
      trackOrder(orderId);
    }
  };

  const isTrackDisabled = loading || !orderId.trim();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-6">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="container mx-auto px-4 relative">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-semibold">Track Order</span>
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium text-sm">
                  Order Tracking
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Track Your{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Order
                </span>
              </h1>

              <p className="text-muted-foreground">
                Enter your order ID to see the current status
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="mb-10">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <Label
                  htmlFor="orderId"
                  className="flex items-center gap-2 mb-3"
                >
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Order ID
                </Label>

                <div className="flex gap-3">
                  <Input
                    id="orderId"
                    type="text"
                    placeholder="Enter your Order ID (e.g., ORD-XXXX-XXXX)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1 h-12 font-mono"
                  />

                  <Button
                    type="submit"
                    disabled={isTrackDisabled}
                    className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Track
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {error && !loading && (
              <div className="bg-card border-2 border-destructive/50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-2">
                  Order Not Found
                </h2>

                <p className="text-muted-foreground mb-6">{error}</p>

                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setOrderId("");
                  }}
                  className="border-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {status && !loading && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order Status
                        </p>
                        <p className="font-mono text-sm text-foreground">
                          {orderId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={getStatusBadgeVariant(status)}
                        className="text-sm px-4 py-1.5 font-semibold"
                      >
                        {status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="h-9 w-9"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>

                  {status === "CANCELLED" ? (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 text-center">
                      <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />

                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Order Cancelled
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4">
                        This order has been cancelled. Please contact support if
                        you need assistance.
                      </p>

                      <Button asChild variant="outline" className="border-2">
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {ORDER_STEPS.map((step, index) => {
                        const state = getStepState(step.status, status);
                        const Icon = step.icon;
                        const isLast = index === ORDER_STEPS.length - 1;

                        return (
                          <div key={step.status} className="relative">
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                              <div className="relative">
                                <div
                                  className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
                                    state === "completed"
                                      ? "bg-gradient-to-br from-green-400 to-emerald-500 border-transparent text-white shadow-lg shadow-green-500/25"
                                      : state === "current"
                                        ? "border-primary text-primary bg-primary/10"
                                        : "border-border text-muted-foreground bg-muted/50"
                                  }`}
                                >
                                  {state === "completed" ? (
                                    <Check className="h-6 w-6" />
                                  ) : (
                                    <Icon className="h-6 w-6" />
                                  )}
                                </div>

                                {!isLast && (
                                  <div
                                    className={`absolute left-1/2 top-full w-0.5 h-8 -translate-x-1/2 ${
                                      state === "completed"
                                        ? "bg-gradient-to-b from-green-400 to-emerald-500"
                                        : "bg-border"
                                    }`}
                                  />
                                )}
                              </div>

                              <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`font-semibold ${
                                      state === "pending"
                                        ? "text-muted-foreground"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {step.label}
                                  </h4>

                                  {state === "current" && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                      Current
                                    </span>
                                  )}

                                  {state === "completed" && (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                </div>

                                <p
                                  className={`text-sm mt-0.5 ${
                                    state === "pending"
                                      ? "text-muted-foreground/60"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline" className="border-2">
                    <Link href="/shop">
                      <Package className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="border-2">
                    <Link href="/contact">
                      <Search className="h-4 w-4 mr-2" />
                      Need Help?
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {!status && !error && !loading && (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-primary" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-2">
                  Enter Your Order ID
                </h2>

                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  You can find your order ID in the confirmation email or your
                  order history.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline" className="border-2">
                    <Link href="/shop">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Shop
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
