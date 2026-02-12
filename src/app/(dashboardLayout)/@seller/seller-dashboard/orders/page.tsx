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
  TrendingUp,
  ShoppingBag,
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
  bgColor: string;
  textColor: string;
  borderColor: string;
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
      bgColor: "bg-slate-100",
      textColor: "text-slate-700",
      borderColor: "border-slate-300",
    },
    {
      label: "Processing",
      count: orders.filter((o) => o.status === "PROCESSING").length,
      icon: Box,
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
      borderColor: "border-amber-300",
    },
    {
      label: "Shipped",
      count: orders.filter((o) => o.status === "SHIPPED").length,
      icon: Truck,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-300",
    },
    {
      label: "Delivered",
      count: orders.filter((o) => o.status === "DELIVERED").length,
      icon: CheckCircle,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-300",
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
        <Card className="border-2 border-red-200 shadow-lg">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center border-2 border-red-200">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Failed to Load Orders
                </h3>
                <p className="text-red-600 text-sm font-medium">{error.message}</p>
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
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardContent className="py-20">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-200">
                <ShoppingBag className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-600 text-sm max-w-sm">
                  Orders will appear here when customers purchase your products. Start promoting your store!
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
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Orders</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-2">{orderCount}</h3>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
                <h3 className="text-3xl font-bold text-emerald-900 mt-2">{formatCurrency(totalRevenue)}</h3>
              </div>
              <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {statusCounts.slice(0, 2).map((status) => {
          const Icon = status.icon;
          return (
            <Card key={status.label} className={`border-2 ${status.borderColor} ${status.bgColor} shadow-md`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${status.textColor}`}>{status.label}</p>
                    <h3 className={`text-3xl font-bold ${status.textColor} mt-2`}>{status.count}</h3>
                  </div>
                  <div className={`w-14 h-14 ${status.bgColor} border-2 ${status.borderColor} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className={`h-7 w-7 ${status.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders Table */}
      <Card className="border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Order Management</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Track and manage all your orders
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusCounts.map((status) => {
                const Icon = status.icon;
                return (
                  <div
                    key={status.label}
                    className={`px-4 py-2 rounded-xl border-2 ${status.borderColor} ${status.bgColor} flex items-center gap-2 shadow-sm`}
                  >
                    <Icon className={`h-4 w-4 ${status.textColor}`} />
                    <span className={`text-sm font-bold ${status.textColor}`}>
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
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2">
                  <TableHead className="font-bold text-gray-900">Order ID</TableHead>
                  <TableHead className="font-bold text-gray-900">Customer</TableHead>
                  <TableHead className="font-bold text-gray-900">Contact</TableHead>
                  <TableHead className="font-bold text-gray-900">Items</TableHead>
                  <TableHead className="font-bold text-gray-900">Total</TableHead>
                  <TableHead className="font-bold text-gray-900">Status</TableHead>
                  <TableHead className="font-bold text-gray-900">Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(orders as Order[]).map((order) => (
                  <TableRow key={order.id} className="hover:bg-blue-50/50 transition-colors border-b">
                    <TableCell>
                      <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                        {formatOrderId(order.id)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-mono font-medium text-gray-900">{order.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600">
                          <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="line-clamp-2 max-w-[180px] leading-relaxed">
                            {order.shippingAddress}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2 max-w-[220px]">
                        {order.orderItems.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm bg-gray-50 rounded-lg p-2 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900 truncate">
                                {item.medicine.name}
                              </span>
                              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md ml-2">
                                ×{item.quantity}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">
                              {formatCurrency(item.price)} each
                            </span>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-md inline-block border border-blue-200">
                            +{order.orderItems.length - 2} more items
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 py-2 rounded-xl border-2 border-emerald-200 shadow-sm">
                        <span className="text-lg font-bold text-emerald-700">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{formatDate(order.createdAt)}</span>
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