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
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
    SHIPPED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PROCESSING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    PLACED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
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

const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString()}`;
};

export default async function CustomerOrdersPage() {
  const { data: orders, error } = await getUserOrdersAction();

  const hasOrders = orders && orders.length > 0;
  const orderCount = orders?.length || 0;

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
              <span className="text-foreground font-semibold">My Orders</span>
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium text-sm">
                    {orderCount} {orderCount === 1 ? "Order" : "Orders"}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  My Orders
                </h1>
              </div>

              <Button asChild variant="outline" className="border-2">
                <Link href="/orders/track">
                  <PackageSearch className="h-4 w-4 mr-2" />
                  Track Order
                </Link>
              </Button>
            </div>

            {error ? (
              <div className="bg-card border-2 border-destructive/30 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-2">
                  Failed to Load Orders
                </h2>

                <p className="text-muted-foreground mb-6">{error.message}</p>

                <Button asChild variant="outline" className="border-2">
                  <Link href="/">Go Back Home</Link>
                </Button>
              </div>
            ) : !hasOrders ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-2xl scale-150" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                    <Package className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-3">
                  No Orders Yet
                </h2>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  You haven&apos;t placed any orders yet. Start exploring our products and place your first order!
                </p>

                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                >
                  <Link href="/shop">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Start Shopping
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden lg:block bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">Order ID</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Items</TableHead>
                        <TableHead className="font-semibold">Phone</TableHead>
                        <TableHead className="font-semibold">Address</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(orders as Order[]).map((order) => (
                        <TableRow key={order.id} className="hover:bg-muted/30">
                          <TableCell>
                            <Link
                              href={`/orders/track?orderId=${order.id}`}
                              className="inline-flex items-center gap-1 font-mono font-semibold text-primary hover:underline"
                            >
                              {formatOrderId(order.id)}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </TableCell>

                          <TableCell className="text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </TableCell>

                          <TableCell>
                            <OrderItemsList items={order.orderItems} />
                          </TableCell>

                          <TableCell className="font-mono text-sm">
                            {order.phone}
                          </TableCell>

                          <TableCell>
                            <div className="max-w-40 truncate text-muted-foreground" title={order.shippingAddress}>
                              {order.shippingAddress}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(order.status)}
                              className={`font-semibold ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <span className="font-bold text-foreground">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="lg:hidden space-y-4">
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
    return <span className="text-muted-foreground text-sm">No items</span>;
  }

  return (
    <div className="max-w-48 space-y-1">
      {items.slice(0, 2).map((item) => (
        <div key={item.id} className="text-sm truncate">
          <span className="text-foreground">{item.medicine.name}</span>
          <span className="text-muted-foreground"> × {item.quantity}</span>
        </div>
      ))}
      {items.length > 2 && (
        <span className="text-xs text-primary font-medium">
          +{items.length - 2} more items
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
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link
            href={`/orders/track?orderId=${order.id}`}
            className="inline-flex items-center gap-1 font-mono font-bold text-primary hover:underline"
          >
            {formatOrderId(order.id)}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(order.createdAt)}
          </div>
        </div>

        <Badge
          variant={getStatusBadgeVariant(order.status)}
          className={`font-semibold ${getStatusColor(order.status)}`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            {order.orderItems.slice(0, 2).map((item) => (
              <div key={item.id}>
                <span className="text-foreground">{item.medicine.name}</span>
                <span className="text-muted-foreground"> × {item.quantity}</span>
              </div>
            ))}
            {order.orderItems.length > 2 && (
              <span className="text-xs text-primary font-medium">
                +{order.orderItems.length - 2} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-mono">{order.phone}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-muted-foreground line-clamp-2">{order.shippingAddress}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>
    </div>
  );
};