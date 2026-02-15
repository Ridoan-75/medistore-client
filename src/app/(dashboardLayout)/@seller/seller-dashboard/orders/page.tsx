import { sellerProductService } from "@/src/services/seller.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import OrderStatusSelect from "./OrderStatusSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SellerOrderPage() {
  const { data: orders, error } = await sellerProductService.getSellerOrders();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage your customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Manage your customer orders ({orders.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Shipping Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell className="max-w-50 truncate">
                    {order.shippingAddress}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="text-xs">
                          <span className="font-medium">{item.medicine.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            x{item.quantity} @ ৳{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ৳{order.totalAmount}
                  </TableCell>
                  <TableCell>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
