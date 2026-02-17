"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getUserOrdersAction, trackOrderStatusAction } from "@/src/actions/order.action";
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
  ArrowLeft,
  RefreshCw,
  LucideIcon,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  CalendarDays,
  DollarSign,
  ShoppingBag,
  ListOrdered,
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
  { status: "PLACED",     label: "Order Placed", icon: Clock,        description: "Your order has been received" },
  { status: "PROCESSING", label: "Processing",   icon: Box,          description: "Preparing your items"        },
  { status: "SHIPPED",    label: "Shipped",      icon: Truck,        description: "On the way to you"           },
  { status: "DELIVERED",  label: "Delivered",    icon: PackageCheck, description: "Order completed"             },
];

const STATUS_ORDER = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const getStepState = (stepStatus: string, currentStatus: OrderStatus | null): StepState => {
  if (!currentStatus || currentStatus === "CANCELLED") return "pending";
  const currentIndex = STATUS_ORDER.indexOf(currentStatus as (typeof STATUS_ORDER)[number]);
  const stepIndex    = STATUS_ORDER.indexOf(stepStatus    as (typeof STATUS_ORDER)[number]);
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "pending";
};

const getStatusBadgeVariant = (status: OrderStatus): "default" | "destructive" | "secondary" => {
  if (status === "DELIVERED") return "default";
  if (status === "CANCELLED") return "destructive";
  return "secondary";
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "DELIVERED":   return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800";
    case "CANCELLED":   return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
    case "SHIPPED":     return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800";
    case "PROCESSING":  return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
    default:            return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const formatAmount = (amount: string) => {
  return parseFloat(amount).toFixed(2);
};

export default function OrderTrackPage() {
  const searchParams  = useSearchParams();
  const orderIdParam  = searchParams.get("orderId");

  // — views: "list" | "detail"
  const [view, setView]           = useState<"list" | "detail">("list");

  // — orders list state
  const [orders, setOrders]               = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError]     = useState<string | null>(null);

  // — detail / search state
  const [selectedOrderId, setSelectedOrderId] = useState(orderIdParam || "");
  const [searchInput, setSearchInput]         = useState(orderIdParam || "");
  const [status, setStatus]                   = useState<OrderStatus | null>(null);
  const [detailError, setDetailError]         = useState<string | null>(null);
  const [detailLoading, setDetailLoading]     = useState(false);

  const hasLoadedInitial = useRef(false);

  // ── fetch all user orders on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      const result = await getUserOrdersAction();
      if (result.error) {
        setOrdersError(result.error.message);
      } else {
        setOrders((result.data as Order[]) || []);
      }
      setOrdersLoading(false);
    };
    fetchOrders();
  }, []);

  // ── if orderId param present, jump straight to detail ───────────────────
  useEffect(() => {
    if (!orderIdParam || hasLoadedInitial.current) return;
    hasLoadedInitial.current = true;
    openOrderDetail(orderIdParam);
  }, [orderIdParam]);

  // ── track a specific order ───────────────────────────────────────────────
  const trackOrder = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setDetailLoading(true);
    setDetailError(null);
    setStatus(null);

    const result = await trackOrderStatusAction(id.trim());
    if (result.error) {
      setDetailError(result.error.message);
    } else if (result.data) {
      setStatus(result.data.status);
    }
    setDetailLoading(false);
  }, []);

  const openOrderDetail = (id: string) => {
    setSelectedOrderId(id);
    setSearchInput(id);
    setStatus(null);
    setDetailError(null);
    setView("detail");
    trackOrder(id);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    openOrderDetail(searchInput);
  };

  const handleRefresh = () => {
    if (selectedOrderId.trim()) trackOrder(selectedOrderId);
  };

  const goBackToList = () => {
    setView("list");
    setStatus(null);
    setDetailError(null);
    setSelectedOrderId("");
    setSearchInput("");
  };

  // ── selected order metadata (from already-fetched list) ─────────────────
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // ═══════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/20">
      <main className="flex-1">

        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 py-8 border-b border-amber-200/50 dark:border-amber-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link href="/" className="text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              {view === "detail" ? (
                <>
                  <button onClick={goBackToList} className="text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors">
                    Track Order
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[160px]">
                    {selectedOrderId}
                  </span>
                </>
              ) : (
                <span className="text-slate-900 dark:text-white font-semibold">Track Order</span>
              )}
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-full border border-amber-500/30 mb-8 shadow-lg shadow-amber-500/10">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-300 font-semibold text-sm tracking-wide">
                  ORDER TRACKING
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                {view === "list" ? (
                  <>Your <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Orders</span></>
                ) : (
                  <>Track Your <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Order</span></>
                )}
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                {view === "list"
                  ? "Click any order to see its live tracking status"
                  : "Real-time status of your order"}
              </p>
            </div>

            {/* ════════════════════════════════════════════════════════
                VIEW: LIST
            ════════════════════════════════════════════════════════ */}
            {view === "list" && (
              <>
                {/* Search bar — manual lookup */}
                <form onSubmit={handleSearchSubmit} className="mb-8">
                  <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                    <Label htmlFor="searchId" className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300 font-bold text-base">
                      <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      Or search by Order ID
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        id="searchId"
                        type="text"
                        placeholder="ORD-XXXX-XXXX-XXXX"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1 h-14 font-mono text-base border-2 rounded-2xl border-slate-300 dark:border-slate-700"
                      />
                      <Button
                        type="submit"
                        disabled={!searchInput.trim()}
                        className="h-14 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-xl font-black rounded-2xl transition-all duration-300 hover:scale-105"
                      >
                        <Search className="h-5 w-5 mr-2" />
                        Track
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Orders list */}
                {ordersLoading && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your orders…</p>
                  </div>
                )}

                {!ordersLoading && ordersError && (
                  <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900 rounded-3xl p-10 text-center shadow-xl">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Failed to load orders</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{ordersError}</p>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-xl">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-3xl blur-3xl animate-pulse" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <ShoppingBag className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No orders yet</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">You haven't placed any orders. Start shopping!</p>
                    <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-8 h-12 rounded-2xl">
                      <Link href="/shop">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Go to Shop
                      </Link>
                    </Button>
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <ListOrdered className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {orders.length} order{orders.length > 1 ? "s" : ""} found
                      </span>
                    </div>

                    {orders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => openOrderDetail(order.id)}
                        className="w-full text-left bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Left: icon + id */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-mono text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                                {order.id}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  {formatDate(order.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: amount + status + arrow */}
                          <div className="flex items-center gap-3 sm:flex-shrink-0">
                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-black text-base">
                              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">৳</span>
                              {formatAmount(order.totalAmount)}
                            </div>

                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>

                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Items preview */}
                        {order.orderItems?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                            {order.orderItems.slice(0, 3).map((item) => (
                              <span
                                key={item.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                              >
                                <Box className="h-3 w-3" />
                                {item.medicine.name}
                                <span className="text-slate-400">×{item.quantity}</span>
                              </span>
                            ))}
                            {order.orderItems.length > 3 && (
                              <span className="inline-flex items-center px-3 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                +{order.orderItems.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ════════════════════════════════════════════════════════
                VIEW: DETAIL
            ════════════════════════════════════════════════════════ */}
            {view === "detail" && (
              <>
                {/* Back button */}
                <button
                  onClick={goBackToList}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-8 group"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to all orders
                </button>

                {/* Order meta card (from list data) */}
                {selectedOrder && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-6 mb-6 shadow-lg">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Order ID</p>
                        <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> Date
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Total</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">৳{formatAmount(selectedOrder.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {detailLoading && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching order status…</p>
                  </div>
                )}

                {/* Error */}
                {detailError && !detailLoading && (
                  <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900 rounded-3xl p-10 text-center shadow-xl">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/50 dark:to-orange-950/50 rounded-full flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                        <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Order Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">{detailError}</p>
                    <Button variant="outline" onClick={goBackToList} className="border-2 border-slate-300 dark:border-slate-700 font-semibold px-8 h-12 rounded-2xl">
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back to Orders
                    </Button>
                  </div>
                )}

                {/* Tracking card */}
                {status && !detailLoading && (
                  <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <Package className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mb-1">Order Status</p>
                            <p className="font-mono text-base font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                              {selectedOrderId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge variant={getStatusBadgeVariant(status)} className="text-base px-5 py-2 font-black rounded-xl">
                            {status}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={detailLoading} className="h-12 w-12 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                            <RefreshCw className={`h-5 w-5 ${detailLoading ? "animate-spin" : ""}`} />
                          </Button>
                        </div>
                      </div>

                      {/* Cancelled */}
                      {status === "CANCELLED" ? (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200 dark:border-red-900 rounded-3xl p-10 text-center">
                          <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-red-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                              <XCircle className="h-10 w-10 text-white" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Order Cancelled</h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium max-w-md mx-auto">
                            This order has been cancelled. Please contact support if you need assistance.
                          </p>
                          <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-xl font-semibold px-8 h-12 rounded-2xl">
                            <Link href="/contact">Contact Support</Link>
                          </Button>
                        </div>
                      ) : (
                        /* Steps */
                        <div className="space-y-2">
                          {ORDER_STEPS.map((step, index) => {
                            const state  = getStepState(step.status, status);
                            const Icon   = step.icon;
                            const isLast = index === ORDER_STEPS.length - 1;

                            return (
                              <div key={step.status} className="relative">
                                <div className="flex items-start gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-900 transition-all duration-300">
                                  <div className="relative">
                                    <div className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-500 ${
                                      state === "completed"
                                        ? "bg-gradient-to-br from-emerald-400 to-teal-600 border-transparent text-white shadow-2xl shadow-emerald-500/30 scale-110"
                                        : state === "current"
                                          ? "border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 shadow-lg shadow-amber-500/20"
                                          : "border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900"
                                    }`}>
                                      {state === "completed" ? <Check className="h-8 w-8" /> : <Icon className="h-8 w-8" />}
                                    </div>

                                    {!isLast && (
                                      <div className={`absolute left-1/2 top-full w-1 h-10 -translate-x-1/2 rounded-full ${
                                        state === "completed"
                                          ? "bg-gradient-to-b from-emerald-400 to-teal-600"
                                          : "bg-slate-200 dark:bg-slate-800"
                                      }`} />
                                    )}
                                  </div>

                                  <div className="flex-1 pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className={`font-black text-lg ${state === "pending" ? "text-slate-400 dark:text-slate-600" : "text-slate-900 dark:text-white"}`}>
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
                                    <p className={`text-sm font-medium ${state === "pending" ? "text-slate-400 dark:text-slate-600" : "text-slate-600 dark:text-slate-400"}`}>
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

                    {/* Bottom actions */}
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
              </>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}