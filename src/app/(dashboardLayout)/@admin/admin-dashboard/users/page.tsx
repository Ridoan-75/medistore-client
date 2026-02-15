import React from "react";
import { getAllUsersAction } from "@/src/actions/admin.action";
import { User } from "@/src/services/admin.service";
import { Roles } from "@/src/constants/roles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import UserStatusDropdown from "./UserStatusDropdown";
import {
  Users,
  UserCircle,
  Shield,
  Store,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";

const getRoleBadgeConfig = (role: string) => {
  switch (role) {
    case Roles.ADMIN:
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
        icon: Shield,
      };
    case Roles.SELLER:
      return {
        variant: "default" as const,
        className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
        icon: Store,
      };
    case Roles.CUSTOMER:
      return {
        variant: "secondary" as const,
        className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        icon: UserCircle,
      };
    default:
      return {
        variant: "outline" as const,
        className: "",
        icon: UserCircle,
      };
  }
};

export default async function AllUsersPage() {
  const { data: users, error } = await getAllUsersAction();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Failed to load users</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalUsers = users?.length || 0;
  const adminCount = users?.filter((u: User) => u.role === Roles.ADMIN).length || 0;
  const sellerCount = users?.filter((u: User) => u.role === Roles.SELLER).length || 0;
  const customerCount = users?.filter((u: User) => u.role === Roles.CUSTOMER).length || 0;
  const activeUsers = users?.filter((u: User) => u.status === "ACTIVE").length || 0;
  const bannedUsers = users?.filter((u: User) => u.status === "BANNED").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage all users and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Seller accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bannedUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Restricted users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Full system access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Store className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Product management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Regular buyers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription className="mt-1">
            Complete list of all registered users ({totalUsers} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user: User) => {
                    const roleConfig = getRoleBadgeConfig(user.role);
                    const RoleIcon = roleConfig.icon;

                    return (
                      <TableRow key={user.id}>
                        {/* User Info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <RoleIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {user.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>

                        {/* Role Badge */}
                        <TableCell>
                          <Badge
                            variant={roleConfig.variant}
                            className={`${roleConfig.className} border`}
                          >
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </TableCell>

                        {/* Status Dropdown */}
                        <TableCell className="text-right">
                          <UserStatusDropdown
                            userId={user.id}
                            currentStatus={user.status}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">No users found</p>
                          <p className="text-sm text-muted-foreground">
                            No users are registered in the system
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}