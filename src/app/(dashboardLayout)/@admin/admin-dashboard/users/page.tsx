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
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Users,
  AlertCircle,
  Shield,
  Store,
  UserIcon,
  Mail,
  Crown,
  UserCheck,
  UserX,
} from "lucide-react";
import UserStatusDropdown from "./UserStatusDropdown";

type UserRole = typeof Roles[keyof typeof Roles];
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface RoleConfig {
  variant: BadgeVariant;
  className: string;
  icon: typeof Shield;
  label: string;
}

const ROLE_CONFIG: Record<string, RoleConfig> = {
  [Roles.ADMIN]: {
    variant: "destructive",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: Crown,
    label: "Admin",
  },
  [Roles.SELLER]: {
    variant: "default",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Store,
    label: "Seller",
  },
  [Roles.CUSTOMER]: {
    variant: "secondary",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: UserIcon,
    label: "Customer",
  },
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRoleConfig = (role: string): RoleConfig => {
  return (
    ROLE_CONFIG[role] || {
      variant: "outline" as BadgeVariant,
      className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
      icon: UserIcon,
      label: role,
    }
  );
};

export default async function AllUsersPage() {
  const { data: users, error } = await getAllUsersAction();

  const userCount = users?.length || 0;
  const adminCount = users?.filter((u: User) => u.role === Roles.ADMIN).length || 0;
  const sellerCount = users?.filter((u: User) => u.role === Roles.SELLER).length || 0;
  const customerCount = users?.filter((u: User) => u.role === Roles.CUSTOMER).length || 0;
  const activeCount = users?.filter((u: User) => u.status === "ACTIVE").length || 0;

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-2 border-destructive/30">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Failed to Load Users
                </h3>
                <p className="text-destructive text-sm">{error.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">All Users</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {userCount} {userCount === 1 ? "user" : "users"} registered
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {adminCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{adminCount} Admins</span>
                </div>
              )}
              {sellerCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{sellerCount} Sellers</span>
                </div>
              )}
              {customerCount > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{customerCount} Customers</span>
                </div>
              )}
              <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{activeCount} Active</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user: User) => {
                    const roleConfig = getRoleConfig(user.role);
                    const RoleIcon = roleConfig.icon;

                    return (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center ring-2 ring-border">
                              <span className="font-bold text-sm text-primary">
                                {getInitials(user.name)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {user.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {user.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={roleConfig.variant}
                            className={`${roleConfig.className} font-semibold`}
                          >
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleConfig.label}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <UserStatusDropdown
                            userId={user.id}
                            currentStatus={user.status}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <UserX className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Users Found
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Users will appear here when they register.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}