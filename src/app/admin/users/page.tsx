'use client'

import { useState } from 'react'
import { Search, MoreVertical, Ban, CheckCircle, Users as UsersIcon } from 'lucide-react'
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

interface User {
  id: number
  name: string
  email: string
  role: 'customer' | 'seller'
  status: 'active' | 'banned'
  joined: string
}

interface UserTableProps {
  users: User[]
  onBanUser: (userId: number) => void
  onUnbanUser: (userId: number) => void
}

// Separate UserTable component outside of the main component
function UserTable({ users, onBanUser, onUnbanUser }: UserTableProps) {
  return (
    <div className="rounded-md border">
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
              <TableCell colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <UsersIcon className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">No users found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      user.role === 'seller' 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50'
                    }
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                      <CheckCircle className="w-3 h-3 mr-1.5" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                      <Ban className="w-3 h-3 mr-1.5" />
                      Banned
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.joined).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Orders</DropdownMenuItem>
                      {user.status === 'active' ? (
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onBanUser(user.id)}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="text-emerald-600 focus:text-emerald-600"
                          onClick={() => onUnbanUser(user.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
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
    </div>
  )
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showUnbanDialog, setShowUnbanDialog] = useState(false)

  // Mock users data
  const allUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'seller', status: 'active', joined: '2024-01-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'customer', status: 'active', joined: '2024-01-25' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'customer', status: 'banned', joined: '2024-02-01' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'seller', status: 'active', joined: '2024-02-05' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'customer', status: 'active', joined: '2024-02-08' },
    { id: 7, name: 'David Wilson', email: 'david@example.com', role: 'seller', status: 'banned', joined: '2024-01-10' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'customer', status: 'active', joined: '2024-01-18' },
  ]

  const filterUsers = (role?: User['role']) => {
    return allUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = !role || user.role === role
      return matchesSearch && matchesRole
    })
  }

  const getUserCount = (role?: User['role'], status?: User['status']) => {
    return allUsers.filter(user => {
      const matchesRole = !role || user.role === role
      const matchesStatus = !status || user.status === status
      return matchesRole && matchesStatus
    }).length
  }

  const customers = filterUsers('customer')
  const sellers = filterUsers('seller')
  const banned = allUsers.filter(u => u.status === 'banned' && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleBanUser = (userId: number) => {
    setSelectedUser(userId)
    setShowBanDialog(true)
  }

  const handleUnbanUser = (userId: number) => {
    setSelectedUser(userId)
    setShowUnbanDialog(true)
  }

  const confirmBan = () => {
    console.log('Ban user:', selectedUser)
    setShowBanDialog(false)
    setSelectedUser(null)
  }

  const confirmUnban = () => {
    console.log('Unban user:', selectedUser)
    setShowUnbanDialog(false)
    setSelectedUser(null)
  }

  const selectedUserData = allUsers.find(u => u.id === selectedUser)

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground mt-1">
          Manage all users, customers, and sellers
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
                All Users
                <Badge variant="secondary" className="ml-2">
                  {allUsers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="customers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-slate-600 rounded-none"
              >
                Customers
                <Badge variant="secondary" className="ml-2">
                  {getUserCount('customer')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="sellers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none"
              >
                Sellers
                <Badge variant="secondary" className="ml-2">
                  {getUserCount('seller')}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="banned"
                className="data-[state=active]:border-b-2 data-[state=active]:border-red-600 rounded-none"
              >
                Banned
                <Badge variant="secondary" className="ml-2">
                  {getUserCount(undefined, 'banned')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6 m-0">
            <UserTable 
              users={filterUsers()} 
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
            />
          </TabsContent>

          <TabsContent value="customers" className="p-6 m-0">
            <UserTable 
              users={customers}
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
            />
          </TabsContent>

          <TabsContent value="sellers" className="p-6 m-0">
            <UserTable 
              users={sellers}
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
            />
          </TabsContent>

          <TabsContent value="banned" className="p-6 m-0">
            <UserTable 
              users={banned}
              onBanUser={handleBanUser}
              onUnbanUser={handleUnbanUser}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Ban Confirmation Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban <span className="font-semibold">{selectedUserData?.name}</span>? 
              They will not be able to access their account until unbanned.
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

      {/* Unban Confirmation Dialog */}
      <AlertDialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unban User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unban <span className="font-semibold">{selectedUserData?.name}</span>? 
              They will regain full access to their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnban} className="bg-emerald-600 hover:bg-emerald-700">
              Unban User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}