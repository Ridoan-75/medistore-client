import { getUserOrdersAction } from "@/src/actions/order.action";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Order } from "@/src/services/order.service";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

function getStatusBadgeVariant(status: Order["status"]) {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "SHIPPED":
    case "PROCESSING":
      return "secondary";
    default:
      return "outline";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function CustomerOrders() {
  const { data: orders, error } = await getUserOrdersAction();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">My Orders</span>
            </nav>
          </div>
        </div>

        {/* Orders Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              My Orders
            </h1>

            {error ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Failed to load orders
                </h2>
                <p className="text-muted-foreground">{error.message}</p>
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No orders yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orders as Order[]).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/orders/track?orderId=${order.id}`}
                            className="text-primary hover:underline"
                          >
                            #{order.id.slice(0, 8).toUpperCase()}
                          </Link>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="max-w-50">
                            {order.orderItems.length === 0 ? (
                              <span className="text-muted-foreground">
                                No items
                              </span>
                            ) : (
                              <div className="space-y-1">
                                {order.orderItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="text-sm truncate"
                                  >
                                    {item.medicine.name} x{item.quantity}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell>
                          <div className="max-w-40 truncate">
                            {order.shippingAddress}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ৳{order.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
