"use client";

import React, { useState } from "react";
import { updateUserStatusAction } from "@/src/actions/admin.action";
import { userStatus } from "@/src/constants/userStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface UserStatusDropdownProps {
  userId: string;
  currentStatus: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case userStatus.ACTIVE:
      return {
        label: "Active",
        className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
        icon: CheckCircle2,
        iconColor: "text-green-600",
      };
    case userStatus.BANNED:
      return {
        label: "Banned",
        className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
        icon: XCircle,
        iconColor: "text-red-600",
      };
    default:
      return {
        label: status,
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: CheckCircle2,
        iconColor: "text-gray-600",
      };
  }
};

export default function UserStatusDropdown({
  userId,
  currentStatus,
}: UserStatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setIsLoading(true);
    try {
      const { data, error } = await updateUserStatusAction(userId, newStatus);

      if (error) {
        toast({
          title: "Failed to update status",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      setStatus(newStatus);
      toast({
        title: "Status updated",
        description: `User status changed to ${getStatusConfig(newStatus).label}`,
      });
      router.refresh();
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  if (isLoading) {
    return (
      <div className="flex items-center justify-end gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Updating...</span>
      </div>
    );
  }

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[140px] h-8 border-none shadow-none hover:bg-muted/50">
        <SelectValue>
          <Badge
            variant="outline"
            className={`${statusConfig.className} border flex items-center gap-1.5`}
          >
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value={userStatus.ACTIVE}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="font-medium">Active</span>
              <span className="text-xs text-muted-foreground">
                User can access the system
              </span>
            </div>
          </div>
        </SelectItem>
        <SelectItem value={userStatus.BANNED}>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <div className="flex flex-col">
              <span className="font-medium">Banned</span>
              <span className="text-xs text-muted-foreground">
                User access is restricted
              </span>
            </div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}