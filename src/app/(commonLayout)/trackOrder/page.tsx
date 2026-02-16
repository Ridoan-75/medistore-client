"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Sparkles,
  TrendingUp,
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
  const orderIdParam = searchParams.get("orderId");

  const [orderId, setOrderId] = useState(orderIdParam || "");
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasLoadedInitial = useRef(false);

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
    const loadInitialOrder = async () => {
      if (!orderIdParam || hasLoadedInitial.current) return;
      
      hasLoadedInitial.current = true;
      setLoading(true);
      setError(null);
      setStatus(null);

      const result = await trackOrderStatusAction(orderIdParam.trim());

      if (result.error) {
        setError(result.error.message);
      } else if (result.data) {
        setStatus(result.data.status);
      }

      setLoading(false);
    };

    loadInitialOrder();
  }, [orderIdParam]);

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 py-8 border-b border-amber-200/50 dark:border-amber-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Track Order</span>
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-full border border-amber-500/30 mb-8 shadow-lg shadow-amber-500/10">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-300 font-semibold text-sm tracking-wide">
                  ORDER TRACKING
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                Track Your{" "}
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Order
                </span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                Enter your order ID to see the current status
              </p>
            </div>

            <form onSubmit={handleTrackOrder} className="mb-12">
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                <Label
                  htmlFor="orderId"
                  className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-bold text-base"
                >
                  <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Order ID
                </Label>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    id="orderId"
                    type="text"
                    placeholder="ORD-XXXX-XXXX-XXXX"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1 h-16 font-mono text-base border-2 rounded-2xl border-slate-300 dark:border-slate-700"
                  />

                  <Button
                    type="submit"
                    disabled={isTrackDisabled}
                    className="h-16 px-10 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl shadow-amber-500/30 font-black text-base rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-6 w-6 mr-2" />
                        Track Order
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {error && !loading && (
              <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900 rounded-3xl p-10 text-center shadow-xl">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/50 dark:to-orange-950/50 rounded-full flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                  Order Not Found
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">{error}</p>

                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setOrderId("");
                  }}
                  className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 h-12 rounded-2xl"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {status && !loading && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <Package className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mb-1">
                          Order Status
                        </p>
                        <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
                          {orderId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        variant={getStatusBadgeVariant(status)}
                        className="text-base px-5 py-2 font-black rounded-xl"
                      >
                        {status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="h-12 w-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <RefreshCw
                          className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>

                  {status === "CANCELLED" ? (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200 dark:border-red-900 rounded-3xl p-10 text-center">
                      <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                          <XCircle className="h-10 w-10 text-white" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                        Order Cancelled
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium max-w-md mx-auto">
                        This order has been cancelled. Please contact support if
                        you need assistance.
                      </p>

                      <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-xl font-semibold px-8 h-12 rounded-2xl">
                        <Link href="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ORDER_STEPS.map((step, index) => {
                        const state = getStepState(step.status, status);
                        const Icon = step.icon;
                        const isLast = index === ORDER_STEPS.length - 1;

                        return (
                          <div key={step.status} className="relative">
                            <div className="flex items-start gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-900 transition-all duration-300">
                              <div className="relative">
                                <div
                                  className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-500 ${
                                    state === "completed"
                                      ? "bg-gradient-to-br from-emerald-400 to-teal-600 border-transparent text-white shadow-2xl shadow-emerald-500/30 scale-110"
                                      : state === "current"
                                        ? "border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 shadow-lg shadow-amber-500/20"
                                        : "border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900"
                                  }`}
                                >
                                  {state === "completed" ? (
                                    <Check className="h-8 w-8" />
                                  ) : (
                                    <Icon className="h-8 w-8" />
                                  )}
                                </div>

                                {!isLast && (
                                  <div
                                    className={`absolute left-1/2 top-full w-1 h-10 -translate-x-1/2 rounded-full ${
                                      state === "completed"
                                        ? "bg-gradient-to-b from-emerald-400 to-teal-600"
                                        : "bg-slate-200 dark:bg-slate-800"
                                    }`}
                                  />
                                )}
                              </div>

                              <div className="flex-1 pt-2">
                                <div className="flex items-center justify-between mb-2">
                                  <h4
                                    className={`font-black text-lg ${
                                      state === "pending"
                                        ? "text-slate-400 dark:text-slate-600"
                                        : "text-slate-900 dark:text-white"
                                    }`}
                                  >
                                    {step.label}
                                  </h4>

                                  {state === "current" && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 text-sm font-black rounded-full border border-amber-500/30">
                                      <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse" />
                                      Active
                                    </span>
                                  )}

                                  {state === "completed" && (
                                    <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                  )}
                                </div>

                                <p
                                  className={`text-sm font-medium ${
                                    state === "pending"
                                      ? "text-slate-400 dark:text-slate-600"
                                      : "text-slate-600 dark:text-slate-400"
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 h-12 rounded-2xl">
                    <Link href="/shop">
                      <Package className="h-5 w-5 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 h-12 rounded-2xl">
                    <Link href="/contact">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Need Help?
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {!status && !error && !loading && (
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-xl">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-3xl blur-3xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Package className="h-12 w-12 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
                  Enter Your Order ID
                </h2>

                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-10 font-medium">
                  You can find your order ID in the confirmation email or your
                  order history.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 h-12 rounded-2xl">
                    <Link href="/shop">
                      <ArrowLeft className="h-5 w-5 mr-2" />
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