"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { updateOrderStatusAction } from "@/src/actions/seller.action";
import { toast } from "sonner";

const ORDER_STATUSES = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      const { error } = await updateOrderStatusAction(orderId, newStatus);

      if (error) {
        toast.error(error.message);
        return;
      }

      setStatus(newStatus);
      toast.success("Order status updated successfully");
    });
  };

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
      disabled={isPending}
    >
      <SelectTrigger className="w-32.5">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
