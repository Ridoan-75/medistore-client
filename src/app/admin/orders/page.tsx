"use client"

import { useState } from 'react'
import { Search, Eye, ShoppingBag, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

interface Order {
  id: string
  customer: string
  seller: string
  items: number
  total: number
  status: 'delivered' | 'shipped' | 'processing' | 'placed' | 'cancelled'
  date: string
}

const getStatusBadge = (status: Order['status']) => {
  const config: Record<Order['status'], { className: string }> = {
    delivered: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50' },
    shipped: { className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50' },
    processing: { className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' },
    placed: { className: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50' },
    cancelled: { className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50' },
  }
  return config[status]
}

export function OrderTable({ orders, searchQuery }: { orders: Order[]; searchQuery?: string }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">No orders found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : 'Orders will appear here when placed'}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="font-medium">{order.id}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{order.seller}</div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-normal">
                    <Package className="w-3 h-3 mr-1" />
                    {order.items}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ৳{order.total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(order.status).className}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-emerald-50 hover:text-emerald-600">
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
    </div>
  )
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock orders data
  const allOrders: Order[] = [
    { id: 'ORD-1234', customer: 'John Doe', seller: 'Square Pharma', items: 3, total: 450, status: 'delivered', date: '2024-02-08' },
    { id: 'ORD-1235', customer: 'Jane Smith', seller: 'Beximco Pharma', items: 2, total: 320, status: 'shipped', date: '2024-02-08' },
    { id: 'ORD-1236', customer: 'Mike Johnson', seller: 'Incepta Pharma', items: 5, total: 680, status: 'processing', date: '2024-02-07' },
    { id: 'ORD-1237', customer: 'Sarah Williams', seller: 'Renata Limited', items: 1, total: 150, status: 'placed', date: '2024-02-07' },
    { id: 'ORD-1238', customer: 'Tom Brown', seller: 'ACI Limited', items: 4, total: 520, status: 'cancelled', date: '2024-02-06' },
    { id: 'ORD-1239', customer: 'Emily Davis', seller: 'Square Pharma', items: 2, total: 280, status: 'delivered', date: '2024-02-06' },
    { id: 'ORD-1240', customer: 'David Wilson', seller: 'Healthcare Pharma', items: 3, total: 390, status: 'shipped', date: '2024-02-05' },
    { id: 'ORD-1241', customer: 'Lisa Anderson', seller: 'Opsonin Pharma', items: 6, total: 720, status: 'processing', date: '2024-02-05' },
  ]

  const filterOrders = (status?: Order['status']) => {
    return allOrders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.seller.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !status || order.status === status
      return matchesSearch && matchesStatus
    })
  }

  

  const getOrderCount = (status?: Order['status']) => {
    return filterOrders(status).length
  }
  
  // Moved OrderTable outside component render to avoid creating components during render

  

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground mt-1">
          View and manage all orders from all sellers
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
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
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none"
              >
                All Orders
                <Badge variant="secondary" className="ml-2">
                  {getOrderCount()}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="placed"
                className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none"
              >
                Placed
                <Badge variant="secondary" className="ml-2">
                  {getOrderCount('placed')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="processing"
                className="data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none"
              >
                Processing
                <Badge variant="secondary" className="ml-2">
                  {getOrderCount('processing')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="shipped"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Shipped
                <Badge variant="secondary" className="ml-2">
                  {getOrderCount('shipped')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="delivered"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none"
              >
                Delivered
                <Badge variant="secondary" className="ml-2">
                  {getOrderCount('delivered')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled"
                className="data-[state=active]:border-b-2 data-[state=active]:border-red-600 rounded-none"
              >
                Cancelled
                <Badge variant="secondary" className="ml-2">
                  {getOrderCount('cancelled')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6 m-0">
            <OrderTable orders={filterOrders()} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="placed" className="p-6 m-0">
            <OrderTable orders={filterOrders('placed')} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="processing" className="p-6 m-0">
            <OrderTable orders={filterOrders('processing')} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="shipped" className="p-6 m-0">
            <OrderTable orders={filterOrders('shipped')} searchQuery={searchQuery} />
          </TabsContent>


          <TabsContent value="cancelled" className="p-6 m-0">
            <OrderTable orders={filterOrders('cancelled')} searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}