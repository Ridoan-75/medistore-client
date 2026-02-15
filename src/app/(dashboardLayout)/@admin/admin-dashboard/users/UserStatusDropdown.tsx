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
import { useToast } from "@/src/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UserStatusDropdownProps {
  userId: string;
  currentStatus: string;
}

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
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setStatus(newStatus);
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      router.refresh();
    } catch (error) {
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
      <SelectTrigger className="w-32.5">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={userStatus.ACTIVE}>Active</SelectItem>
        <SelectItem value={userStatus.BANNED}>Banned</SelectItem>
      </SelectContent>
    </Select>
  );
}
