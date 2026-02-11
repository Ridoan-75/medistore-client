"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserStatusAction } from "@/src/actions/admin.action";
import { userStatus } from "@/src/constants/userStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useToast } from "@/src/hooks/use-toast";
import {
  UserCheck,
  UserX,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface UserStatusDropdownProps {
  userId: string;
  currentStatus: string;
}

type StatusType = typeof userStatus[keyof typeof userStatus];

interface StatusConfig {
  icon: typeof UserCheck;
  label: string;
  className: string;
  triggerClassName: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  [userStatus.ACTIVE]: {
    icon: UserCheck,
    label: "Active",
    className: "text-green-600",
    triggerClassName: "border-green-500/30 bg-green-500/5 text-green-600 hover:bg-green-500/10",
  },
  [userStatus.BANNED]: {
    icon: UserX,
    label: "Banned",
    className: "text-red-600",
    triggerClassName: "border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10",
  },
};

const getStatusConfig = (status: string): StatusConfig => {
  return (
    STATUS_CONFIG[status] || {
      icon: UserCheck,
      label: status,
      className: "text-muted-foreground",
      triggerClassName: "border-border",
    }
  );
};

export default function UserStatusDropdown({
  userId,
  currentStatus,
}: UserStatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    const previousStatus = status;
    setStatus(newStatus);
    setIsLoading(true);

    try {
      const { error } = await updateUserStatusAction(userId, newStatus);

      if (error) {
        setStatus(previousStatus);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status Updated",
        description: `User is now ${newStatus.toLowerCase()}`,
      });

      router.refresh();
    } catch {
      setStatus(previousStatus);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isLoading}
    >
      <SelectTrigger
        className={`w-[130px] h-9 border-2 rounded-lg font-medium transition-all ${config.triggerClassName} ${
          isLoading ? "opacity-70" : ""
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <SelectValue />
          </div>
        )}
      </SelectTrigger>

      <SelectContent className="min-w-[130px]">
        <SelectItem
          value={userStatus.ACTIVE}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium">Active</span>
          </div>
        </SelectItem>

        <SelectItem
          value={userStatus.BANNED}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="font-medium">Banned</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}