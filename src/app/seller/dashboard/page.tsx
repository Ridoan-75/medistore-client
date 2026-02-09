import { Package, ShoppingBag, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import StatsCard from '@/components/admin/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SellerDashboardPage() {
  // Mock stats
  const stats = [
    { title: 'Total Medicines', value: '48', icon: Package, change: 5, trend: 'up' as const },
    { title: 'Total Orders', value: '324', icon: ShoppingBag, change: 12, trend: 'up' as const },
    { title: 'Revenue', value: '৳1,24,500', icon: DollarSign, change: 18, trend: 'up' as const },
    { title: 'Pending Orders', value: '12', icon: Clock, change: -3, trend: 'down' as const },
  ]

  // Mock recent orders
  const recentOrders = [
    { id: '#ORD-1234', customer: 'John Doe', items: 3, total: 450, status: 'placed', date: '2024-02-08' },
    { id: '#ORD-1235', customer: 'Jane Smith', items: 2, total: 320, status: 'processing', date: '2024-02-08' },
    { id: '#ORD-1236', customer: 'Mike Johnson', items: 5, total: 680, status: 'shipped', date: '2024-02-07' },
    { id: '#ORD-1237', customer: 'Sarah Williams', items: 1, total: 150, status: 'delivered', date: '2024-02-07' },
    { id: '#ORD-1238', customer: 'Tom Brown', items: 4, total: 520, status: 'placed', date: '2024-02-06' },
  ]

  // Mock low stock medicines
  const lowStockMedicines = [
    { id: 1, name: 'Paracetamol 500mg', stock: 5, price: 50 },
    { id: 2, name: 'Napa Extend 665mg', stock: 3, price: 80 },
    { id: 3, name: 'Sergel 20mg', stock: 8, price: 120 },
    { id: 4, name: 'Maxpro 20mg', stock: 2, price: 150 },
  ]

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      placed: 'bg-purple-100 text-purple-700',
    }
    return config[status] || ''
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockMedicines.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            You have {lowStockMedicines.length} medicines with low stock. Please restock soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.customer}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">৳{order.total}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Low Stock Medicines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alert</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seller/medicines">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        {medicine.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>৳{medicine.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}