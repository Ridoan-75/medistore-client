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
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import UserStatusDropdown from "./UserStatusDropdown";

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case Roles.ADMIN:
      return "destructive";
    case Roles.SELLER:
      return "default";
    case Roles.CUSTOMER:
      return "secondary";
    default:
      return "outline";
  }
};

export default async function AllUsersPage() {
  const { data: users, error } = await getAllUsersAction();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-50">Name</TableHead>
                <TableHead className="w-50">Email</TableHead>
                <TableHead className="w-50">Role</TableHead>
                <TableHead className="w-50">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getRoleBadgeVariant(user.role) as
                            | "default"
                            | "secondary"
                            | "destructive"
                            | "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <UserStatusDropdown
                        userId={user.id}
                        currentStatus={user.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
