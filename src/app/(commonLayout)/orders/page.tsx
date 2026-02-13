import Link from "next/link";
import { getUserOrdersAction } from "@/src/actions/order.action";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Order } from "@/src/services/order.service";
import {
  Package,
  ChevronRight,
  ShoppingBag,
  Calendar,
  Phone,
  MapPin,
  ExternalLink,
  AlertCircle,
  PackageSearch,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Box,
} from "lucide-react";

type OrderStatus = Order["status"];
type BadgeVariant = "default" | "destructive" | "secondary" | "outline";

interface OrderItem {
  id: string;
  quantity: number;
  medicine: {
    name: string;
  };
}

const getStatusBadgeVariant = (status: OrderStatus): BadgeVariant => {
  const variants: Record<OrderStatus, BadgeVariant> = {
    DELIVERED: "default",
    CANCELLED: "destructive",
    SHIPPED: "secondary",
    PROCESSING: "secondary",
    PLACED: "outline",
  };
  return variants[status] || "outline";
};

const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    DELIVERED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
    SHIPPED: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    PROCESSING: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    PLACED: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30",
  };
  return colors[status] || "";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatOrderId = (id: string): string => {
  return `#${id.slice(0, 8).toUpperCase()}`;
};

const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `৳${numAmount.toLocaleString()}`;
};

export default async function CustomerOrdersPage() {
  const { data: orders, error } = await getUserOrdersAction();

  const hasOrders = orders && orders.length > 0;
  const orderCount = orders?.length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-cyan-50/30 dark:from-teal-950/20 dark:via-slate-900 dark:to-cyan-950/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 py-8 border-b border-teal-200/50 dark:border-teal-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">My Orders</span>
            </nav>
          </div>
        </div>

        <section className="py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full border border-teal-500/30 shadow-lg shadow-teal-500/10">
                  <ShoppingBag className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-700 dark:text-teal-300 font-semibold text-sm tracking-wide">
                    {orderCount} {orderCount === 1 ? "ORDER" : "ORDERS"}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  Order History
                </h1>
              </div>

              <Button asChild className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-xl shadow-teal-500/30 font-semibold px-8 h-14 rounded-2xl transition-all duration-300 hover:scale-105">
                <Link href="/orders/track">
                  <PackageSearch className="h-5 w-5 mr-2" />
                  Track Order
                </Link>
              </Button>
            </div>

            {error ? (
              <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-900 rounded-3xl p-16 text-center shadow-xl">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/50 dark:to-orange-950/50 rounded-full flex items-center justify-center border-2 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
                  Failed to Load Orders
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-10 font-medium">{error.message}</p>

                <Button asChild variant="outline" className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold px-8 h-12 rounded-2xl">
                  <Link href="/">Go Back Home</Link>
                </Button>
              </div>
            ) : !hasOrders ? (
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-xl">
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-full blur-3xl scale-150 animate-pulse" />
                  <div className="relative w-28 h-28 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full flex items-center justify-center border-4 border-teal-500/20 shadow-2xl">
                    <Package className="h-14 w-14 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                  No Orders Yet
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-md mx-auto text-lg font-medium">
                  You haven&apos;t placed any orders yet. Start exploring our products and place your first order!
                </p>

                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-2xl shadow-teal-500/30 font-black text-lg h-16 px-10 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/shop">
                    <ShoppingBag className="h-6 w-6 mr-2" />
                    Start Shopping
                    <ArrowRight className="h-6 w-6 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden lg:block bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 hover:from-teal-50 hover:to-cyan-50 dark:hover:from-teal-950/30 dark:hover:to-cyan-950/30 border-b-2 border-slate-200 dark:border-slate-800">
                        <TableHead className="font-black text-slate-900 dark:text-white text-sm">Order ID</TableHead>
                        <TableHead className="font-black text-slate-900 dark:text-white text-sm">Date</TableHead>
                        <TableHead className="font-black text-slate-900 dark:text-white text-sm">Items</TableHead>
                        <TableHead className="font-black text-slate-900 dark:text-white text-sm">Phone</TableHead>
                        <TableHead className="font-black text-slate-900 dark:text-white text-sm">Address</TableHead>
                        <TableHead className="font-black text-slate-900 dark:text-white text-sm">Status</TableHead>
                        <TableHead className="text-right font-black text-slate-900 dark:text-white text-sm">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(orders as Order[]).map((order, index) => (
                        <TableRow key={order.id} className="hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 dark:hover:from-teal-950/10 dark:hover:to-cyan-950/10 border-b border-slate-200 dark:border-slate-800">
                          <TableCell className="py-6">
                            <Link
                              href={`/orders/track?orderId=${order.id}`}
                              className="inline-flex items-center gap-2 font-mono font-black text-teal-600 dark:text-teal-400 hover:underline text-base"
                            >
                              {formatOrderId(order.id)}
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </TableCell>

                          <TableCell className="text-slate-600 dark:text-slate-400 font-semibold">
                            {formatDate(order.createdAt)}
                          </TableCell>

                          <TableCell>
                            <OrderItemsList items={order.orderItems} />
                          </TableCell>

                          <TableCell className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {order.phone}
                          </TableCell>

                          <TableCell>
                            <div className="max-w-48 truncate text-slate-600 dark:text-slate-400 font-medium" title={order.shippingAddress}>
                              {order.shippingAddress}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(order.status)}
                              className={`font-black text-sm px-4 py-1.5 rounded-xl ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <span className="font-black text-teal-600 dark:text-teal-400 text-lg">
                              {formatCurrency(parseFloat(order.totalAmount))}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="lg:hidden space-y-6">
                  {(orders as Order[]).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

interface OrderItemsListProps {
  items: OrderItem[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  if (items.length === 0) {
    return <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">No items</span>;
  }

  return (
    <div className="max-w-56 space-y-2">
      {items.slice(0, 2).map((item) => (
        <div key={item.id} className="text-sm truncate font-medium">
          <span className="text-slate-900 dark:text-white font-bold">{item.medicine.name}</span>
          <span className="text-slate-600 dark:text-slate-400"> × {item.quantity}</span>
        </div>
      ))}
      {items.length > 2 && (
        <span className="inline-flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 font-black">
          <Sparkles className="h-3 w-3" />
          +{items.length - 2} more
        </span>
      )}
    </div>
  );
};

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href={`/orders/track?orderId=${order.id}`}
            className="inline-flex items-center gap-2 font-mono font-black text-teal-600 dark:text-teal-400 hover:underline text-lg"
          >
            {formatOrderId(order.id)}
            <ExternalLink className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400 font-semibold">
            <Calendar className="h-4 w-4" />
            {formatDate(order.createdAt)}
          </div>
        </div>

        <Badge
          variant={getStatusBadgeVariant(order.status)}
          className={`font-black text-sm px-4 py-2 rounded-xl ${getStatusColor(order.status)}`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800">
          <Box className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
          <div className="space-y-1.5 flex-1">
            {order.orderItems.slice(0, 2).map((item) => (
              <div key={item.id} className="font-medium">
                <span className="text-slate-900 dark:text-white font-bold">{item.medicine.name}</span>
                <span className="text-slate-600 dark:text-slate-400"> × {item.quantity}</span>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <span className="inline-flex items-center gap-1 text-sm text-teal-700 dark:text-teal-400 font-black">
                <Sparkles className="h-3.5 w-3.5" />
                +{order.orderItems.length - 2} more items
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800">
          <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="font-mono font-bold text-slate-900 dark:text-white">{order.phone}</span>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800">
          <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 line-clamp-2 font-medium">{order.shippingAddress}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t-2 border-slate-200 dark:border-slate-800">
        <span className="text-base text-slate-600 dark:text-slate-400 font-bold">Total Amount</span>
        <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>
    </div>
  );
};