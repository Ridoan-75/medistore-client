'use client'

import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock orders data
  const allOrders = [
    { id: 'ORD-1234', customer: 'John Doe', seller: 'Square Pharma', items: 3, total: 450, status: 'delivered', date: '2024-02-08' },
    { id: 'ORD-1235', customer: 'Jane Smith', seller: 'Beximco Pharma', items: 2, total: 320, status: 'shipped', date: '2024-02-08' },
    { id: 'ORD-1236', customer: 'Mike Johnson', seller: 'Incepta Pharma', items: 5, total: 680, status: 'processing', date: '2024-02-07' },
    { id: 'ORD-1237', customer: 'Sarah Williams', seller: 'Renata Limited', items: 1, total: 150, status: 'placed', date: '2024-02-07' },
    { id: 'ORD-1238', customer: 'Tom Brown', seller: 'ACI Limited', items: 4, total: 520, status: 'cancelled', date: '2024-02-06' },
    { id: 'ORD-1239', customer: 'Emily Davis', seller: 'Square Pharma', items: 2, total: 280, status: 'delivered', date: '2024-02-06' },
    { id: 'ORD-1240', customer: 'David Wilson', seller: 'Healthcare Pharma', items: 3, total: 390, status: 'shipped', date: '2024-02-05' },
    { id: 'ORD-1241', customer: 'Lisa Anderson', seller: 'Opsonin Pharma', items: 6, total: 720, status: 'processing', date: '2024-02-05' },
  ]

  const filterOrders = (status?: string) => {
    return allOrders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !status || order.status === status
      return matchesSearch && matchesStatus
    })
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string }> = {
      delivered: { className: 'bg-green-100 text-green-700 dark:bg-green-900/30' },
      shipped: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' },
      processing: { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' },
      placed: { className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' },
      cancelled: { className: 'bg-red-100 text-red-700 dark:bg-red-900/30' },
    }
    return config[status] || config.placed
  }

  const OrderTable = ({ orders }: { orders: typeof allOrders }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Seller</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell className="text-muted-foreground">{order.seller}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell className="font-semibold">৳{order.total}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(order.status).className}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">All Orders</h2>
        <p className="text-muted-foreground">View and manage all orders from all sellers</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b px-6 pt-6">
            <TabsList>
              <TabsTrigger value="all">All ({allOrders.length})</TabsTrigger>
              <TabsTrigger value="placed">Placed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6">
            <OrderTable orders={filterOrders()} />
          </TabsContent>

          <TabsContent value="placed" className="p-6">
            <OrderTable orders={filterOrders('placed')} />
          </TabsContent>

          <TabsContent value="processing" className="p-6">
            <OrderTable orders={filterOrders('processing')} />
          </TabsContent>

          <TabsContent value="shipped" className="p-6">
            <OrderTable orders={filterOrders('shipped')} />
          </TabsContent>

          <TabsContent value="delivered" className="p-6">
            <OrderTable orders={filterOrders('delivered')} />
          </TabsContent>

          <TabsContent value="cancelled" className="p-6">
            <OrderTable orders={filterOrders('cancelled')} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}