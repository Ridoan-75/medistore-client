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
import {
  Clock,
  Box,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

const ORDER_STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

interface StatusConfig {
  icon: typeof Clock;
  label: string;
  className: string;
  triggerClassName: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PLACED: {
    icon: Clock,
    label: "Placed",
    className: "text-gray-600",
    triggerClassName: "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100",
  },
  PROCESSING: {
    icon: Box,
    label: "Processing",
    className: "text-amber-600",
    triggerClassName: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  SHIPPED: {
    icon: Truck,
    label: "Shipped",
    className: "text-blue-600",
    triggerClassName: "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  DELIVERED: {
    icon: CheckCircle,
    label: "Delivered",
    className: "text-green-600",
    triggerClassName: "border-green-300 bg-green-50 text-green-700 hover:bg-green-100",
  },
  CANCELLED: {
    icon: XCircle,
    label: "Cancelled",
    className: "text-red-600",
    triggerClassName: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
  },
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === status) return;

    const previousStatus = status;

    startTransition(async () => {
      const { error } = await updateOrderStatusAction(orderId, newStatus);

      if (error) {
        setStatus(previousStatus);
        toast.error(error.message);
        return;
      }

      setStatus(newStatus);
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
    });
  };

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
      disabled={isPending}
    >
      <SelectTrigger
        className={`w-[140px] h-9 border-2 rounded-lg font-medium transition-all ${config.triggerClassName} ${
          isPending ? "opacity-70" : ""
        }`}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Updating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <SelectValue />
          </div>
        )}
      </SelectTrigger>

      <SelectContent className="min-w-[140px]">
        {ORDER_STATUSES.map((orderStatus) => {
          const statusConfig = STATUS_CONFIG[orderStatus];
          const Icon = statusConfig.icon;

          return (
            <SelectItem
              key={orderStatus}
              value={orderStatus}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${statusConfig.className}`} />
                <span className="font-medium">{statusConfig.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}