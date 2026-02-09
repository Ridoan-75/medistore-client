import { Users, ShoppingBag, Package, DollarSign, TrendingUp, UserCheck } from 'lucide-react'
import StatsCard from '@/components/admin/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function AdminDashboardPage() {
  // Mock stats data
  const stats = [
    { title: 'Total Users', value: '2,543', icon: Users, change: 12.5, trend: 'up' as const },
    { title: 'Total Customers', value: '1,892', icon: UserCheck, change: 8.2, trend: 'up' as const },
    { title: 'Total Sellers', value: '651', icon: TrendingUp, change: 5.4, trend: 'up' as const },
    { title: 'Total Medicines', value: '4,829', icon: Package, change: 15.3, trend: 'up' as const },
    { title: 'Total Orders', value: '12,482', icon: ShoppingBag, change: -3.2, trend: 'down' as const },
    { title: 'Total Revenue', value: '৳8,45,920', icon: DollarSign, change: 18.7, trend: 'up' as const },
  ]

  // Mock recent users
  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', date: '2024-02-08' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Seller', date: '2024-02-08' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer', date: '2024-02-07' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Customer', date: '2024-02-07' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Seller', date: '2024-02-06' },
  ]

  // Mock recent orders
  const recentOrders = [
    { id: '#ORD-1234', customer: 'John Doe', total: 450, status: 'delivered', date: '2024-02-08' },
    { id: '#ORD-1235', customer: 'Jane Smith', total: 320, status: 'shipped', date: '2024-02-08' },
    { id: '#ORD-1236', customer: 'Mike Johnson', total: 180, status: 'processing', date: '2024-02-07' },
    { id: '#ORD-1237', customer: 'Sarah Williams', total: 520, status: 'placed', date: '2024-02-07' },
    { id: '#ORD-1238', customer: 'Tom Brown', total: 290, status: 'cancelled', date: '2024-02-06' },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30',
      shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
      processing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30',
      placed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30',
    }
    return variants[status] || ''
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
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
                    <TableCell className="font-semibold">
                      ৳{order.total}
                    </TableCell>
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
      </div>
    </div>
  )
}