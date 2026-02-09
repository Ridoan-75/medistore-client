'use client'

import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function SellerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock orders
  const orders = [
    { id: 'ORD-1234', customer: 'John Doe', items: 3, total: 450, status: 'placed', date: '2024-02-08' },
    { id: 'ORD-1235', customer: 'Jane Smith', items: 2, total: 320, status: 'processing', date: '2024-02-08' },
    { id: 'ORD-1236', customer: 'Mike Johnson', items: 5, total: 680, status: 'shipped', date: '2024-02-07' },
    { id: 'ORD-1237', customer: 'Sarah Williams', items: 1, total: 150, status: 'delivered', date: '2024-02-07' },
    { id: 'ORD-1238', customer: 'Tom Brown', items: 4, total: 520, status: 'placed', date: '2024-02-06' },
  ]

  const filterOrders = (status?: string) => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !status || order.status === status
      return matchesSearch && matchesStatus
    })
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      placed: 'bg-purple-100 text-purple-700',
    }
    return config[status] || ''
  }

  const OrderTable = ({ orders }: { orders: typeof orders }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
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
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.items}</TableCell>
              <TableCell className="font-semibold">৳{order.total}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/seller/orders/${order.id}`}>
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
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
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
              <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
              <TabsTrigger value="placed">Placed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
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
        </Tabs>
      </Card>
    </div>
  )
}