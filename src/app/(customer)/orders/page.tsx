'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Package, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

export default function OrdersPage() {
  // Mock orders data
  const orders = [
    {
      id: 'ORD-1234',
      date: '2024-02-08',
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, image: '/images/medicine-1.jpg' },
        { name: 'Napa Extend 665mg', quantity: 1, image: '/images/medicine-2.jpg' },
      ],
      total: 230,
      status: 'delivered'
    },
    {
      id: 'ORD-1235',
      date: '2024-02-07',
      items: [
        { name: 'Sergel 20mg', quantity: 3, image: '/images/medicine-3.jpg' },
      ],
      total: 410,
      status: 'shipped'
    },
    {
      id: 'ORD-1236',
      date: '2024-02-06',
      items: [
        { name: 'Maxpro 20mg', quantity: 1, image: '/images/medicine-4.jpg' },
        { name: 'Ace 5mg', quantity: 2, image: '/images/medicine-5.jpg' },
      ],
      total: 270,
      status: 'processing'
    },
    {
      id: 'ORD-1237',
      date: '2024-02-05',
      items: [
        { name: 'Filmet 400mg', quantity: 2, image: '/images/medicine-6.jpg' },
      ],
      total: 230,
      status: 'placed'
    },
    {
      id: 'ORD-1238',
      date: '2024-02-04',
      items: [
        { name: 'Fexo 120mg', quantity: 4, image: '/images/medicine-7.jpg' },
      ],
      total: 230,
      status: 'cancelled'
    },
  ]

  const filterOrders = (status?: string) => {
    if (!status) return orders
    return orders.filter(order => order.status === status)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30',
      shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
      processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30',
      placed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30',
    }
    return config[status] || ''
  }

  const OrderCard = ({ order }: { order: typeof orders[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-lg">{order.id}</p>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>
          <Badge className={getStatusBadge(order.status)}>
            {order.status}
          </Badge>
        </div>

        {/* Items Preview */}
        <div className="flex items-center gap-2 mb-4">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </p>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-emerald-600">৳{order.total}</p>
          <div className="flex gap-2">
            {order.status === 'shipped' || order.status === 'delivered' ? (
              <Button variant="outline" size="sm">
                Track Order
              </Button>
            ) : null}
            <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href={`/orders/${order.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const OrdersList = ({ orders }: { orders: typeof orders }) => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              Start shopping to see your orders here
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">My Orders</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="placed">Placed</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <OrdersList orders={orders} />
          </TabsContent>

          <TabsContent value="placed">
            <OrdersList orders={filterOrders('placed')} />
          </TabsContent>

          <TabsContent value="processing">
            <OrdersList orders={filterOrders('processing')} />
          </TabsContent>

          <TabsContent value="shipped">
            <OrdersList orders={filterOrders('shipped')} />
          </TabsContent>

          <TabsContent value="delivered">
            <OrdersList orders={filterOrders('delivered')} />
          </TabsContent>

          <TabsContent value="cancelled">
            <OrdersList orders={filterOrders('cancelled')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}