import Link from "next/link";
import { sellerProductService } from "@/src/services/seller.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ShoppingCart,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Box,
} from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";

type OrderStatus = "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    name: string;
  };
}

interface OrderUser {
  name: string;
  email: string;
}

interface Order {
  id: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  user: OrderUser;
  orderItems: OrderItem[];
}

interface StatusCount {
  label: string;
  count: number;
  icon: typeof Clock;
  className: string;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatOrderId = (id: string): string => {
  return `#${id.slice(0, 8).toUpperCase()}`;
};

const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString()}`;
};

const getStatusCounts = (orders: Order[]): StatusCount[] => {
  const counts: StatusCount[] = [
    {
      label: "Pending",
      count: orders.filter((o) => o.status === "PLACED").length,
      icon: Clock,
      className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    },
    {
      label: "Processing",
      count: orders.filter((o) => o.status === "PROCESSING").length,
      icon: Box,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      label: "Shipped",
      count: orders.filter((o) => o.status === "SHIPPED").length,
      icon: Truck,
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      label: "Delivered",
      count: orders.filter((o) => o.status === "DELIVERED").length,
      icon: CheckCircle,
      className: "bg-green-500/10 text-green-600 border-green-500/20",
    },
  ];

  return counts.filter((c) => c.count > 0);
};

export default async function SellerOrderPage() {
  const { data: orders, error } = await sellerProductService.getSellerOrders();

  const orderCount = orders?.length || 0;
  const statusCounts = orders ? getStatusCounts(orders as Order[]) : [];
  const totalRevenue = orders?.reduce((sum: number, o: Order) => sum + o.totalAmount, 0) || 0;

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-2 border-destructive/30">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Failed to Load Orders
                </h3>
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orders || orderCount === 0) {
    return (
      <div className="p-6">
        <Card className="border-2">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  No Orders Yet
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Orders will appear here when customers purchase your products.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">My Orders</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {orderCount} {orderCount === 1 ? "order" : "orders"} • Total Revenue:{" "}
                  <span className="font-semibold text-primary">
                    {formatCurrency(totalRevenue)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusCounts.map((status) => {
                const Icon = status.icon;
                return (
                  <div
                    key={status.label}
                    className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${status.className}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">
                      {status.count} {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Order</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Items</TableHead>
                  <TableHead className="font-semibold">Total</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(orders as Order[]).map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell>
                      <span className="font-mono text-sm font-semibold text-primary">
                        {formatOrderId(order.id)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono">{order.phone}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span className="line-clamp-2 max-w-[150px]">
                            {order.shippingAddress}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5 max-w-[200px]">
                        {order.orderItems.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm">
                            <span className="font-medium text-foreground">
                              {item.medicine.name}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}× {item.quantity}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              @ {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <span className="text-xs text-primary font-medium">
                            +{order.orderItems.length - 2} more items
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}