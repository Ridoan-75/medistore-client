import { Users, ShoppingBag, Package, DollarSign, TrendingUp, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import StatsCard from '@/components/admin/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string }> = {
      delivered: { variant: 'outline', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50' },
      shipped: { variant: 'outline', className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50' },
      processing: { variant: 'outline', className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' },
      placed: { variant: 'outline', className: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50' },
      cancelled: { variant: 'outline', className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50' },
    }
    return variants[status] || { variant: 'outline' as const, className: '' }
  }

  const getRoleBadge = (role: string) => {
    return role === 'Seller' 
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50'
      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50'
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Heres whats happening with your platform today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
                )}
                <span className={stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}>
                  {Math.abs(stat.change)}%
                </span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        
        {/* Recent Orders - Takes more space */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You have {recentOrders.length} recent orders from this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const statusConfig = getStatusBadge(order.status)
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {order.customer}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className={statusConfig.className}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{order.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              {recentUsers.length} new users joined this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline" className={getRoleBadge(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}