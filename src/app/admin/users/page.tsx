'use client'

import { useState } from 'react'
import { Search, MoreVertical, Ban, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [showBanDialog, setShowBanDialog] = useState(false)

  // Mock users data
  const allUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'seller', status: 'active', joined: '2024-01-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'customer', status: 'active', joined: '2024-01-25' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'customer', status: 'banned', joined: '2024-02-01' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'seller', status: 'active', joined: '2024-02-05' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'customer', status: 'active', joined: '2024-02-08' },
    { id: 7, name: 'David Wilson', email: 'david@example.com', role: 'seller', status: 'banned', joined: '2024-01-10' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'customer', status: 'active', joined: '2024-01-18' },
  ]

  const filterUsers = (role?: string) => {
    return allUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = !role || user.role === role
      return matchesSearch && matchesRole
    })
  }

  const customers = filterUsers('customer')
  const sellers = filterUsers('seller')
  const banned = allUsers.filter(u => u.status === 'banned')

  const handleBanUser = (userId: number) => {
    setSelectedUser(userId)
    setShowBanDialog(true)
  }

  const confirmBan = () => {
    console.log('Ban user:', selectedUser)
    setShowBanDialog(false)
    setSelectedUser(null)
  }

  const UserTable = ({ users }: { users: typeof allUsers }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-emerald-100 text-emerald-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {user.status === 'active' ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><Ban className="w-3 h-3 mr-1" /> Banned</>
                  )}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.joined}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>View Orders</DropdownMenuItem>
                    {user.status === 'active' ? (
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleBanUser(user.id)}
                      >
                        Ban User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600">
                        Unban User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
        <h2 className="text-2xl font-bold">Users Management</h2>
        <p className="text-muted-foreground">Manage all users, customers, and sellers</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
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
              <TabsTrigger value="all">All Users ({allUsers.length})</TabsTrigger>
              <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
              <TabsTrigger value="sellers">Sellers ({sellers.length})</TabsTrigger>
              <TabsTrigger value="banned">Banned ({banned.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6">
            <UserTable users={filterUsers()} />
          </TabsContent>

          <TabsContent value="customers" className="p-6">
            <UserTable users={customers} />
          </TabsContent>

          <TabsContent value="sellers" className="p-6">
            <UserTable users={sellers} />
          </TabsContent>

          <TabsContent value="banned" className="p-6">
            <UserTable users={banned} />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Ban Confirmation Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban this user? They will not be able to access their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBan} className="bg-red-600 hover:bg-red-700">
              Ban User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}