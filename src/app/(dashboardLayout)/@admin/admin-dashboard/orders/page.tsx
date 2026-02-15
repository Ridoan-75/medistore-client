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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { getAllOrdersAction } from "@/src/actions/admin.action";
import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  User,
  MapPin,
  Phone,
  Calendar,
  Store,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const statusMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: "outline",
    PROCESSING: "secondary",
    SHIPPED: "default",
    DELIVERED: "default",
    CANCELLED: "destructive",
  };
  return statusMap[status] || "outline";
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
    PROCESSING: "text-blue-600 bg-blue-50 border-blue-200",
    SHIPPED: "text-purple-600 bg-purple-50 border-purple-200",
    DELIVERED: "text-green-600 bg-green-50 border-green-200",
    CANCELLED: "text-red-600 bg-red-50 border-red-200",
  };
  return colorMap[status] || "text-gray-600 bg-gray-50 border-gray-200";
}

export default async function AllOrderPage() {
  const { data: orders, error } = await getAllOrdersAction();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Failed to load orders</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + order.totalAmount, 0) || 0;
  const pendingOrders = orders?.filter((order: any) => order.status === "PENDING").length || 0;
  const deliveredOrders = orders?.filter((order: any) => order.status === "DELIVERED").length || 0;

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No orders yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Orders will appear here once customers start placing them
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription className="mt-1">
                View and manage all customer orders ({totalOrders} total)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    {/* Order ID */}
                    <TableCell>
                      <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        #{order.id.slice(0, 8)}
                      </div>
                    </TableCell>

                    {/* Customer Info */}
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {order.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Products */}
                    <TableCell>
                      <div className="space-y-1 max-w-[200px]">
                        {order.orderItems.slice(0, 2).map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
                              <Package className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">
                                {item.medicine.name}
                              </p>
                              <p className="text-muted-foreground">
                                {item.quantity}x @ ৳{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <p className="text-xs text-muted-foreground pl-8">
                            +{order.orderItems.length - 2} more
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Seller */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">
                          {order.orderItems[0]?.seller.name || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span>{order.phone}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2 max-w-[150px]">
                            {order.shippingAddress}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Total */}
                    <TableCell>
                      <div className="font-semibold text-base">
                        ৳{order.totalAmount.toLocaleString()}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(order.status)} border`}
                        variant="outline"
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </span>
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