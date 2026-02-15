"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { updateOrderStatusAction } from "@/src/actions/seller.action";
import { toast } from "sonner";
import { 
  Loader2, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react";

const ORDER_STATUSES = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "PLACED":
      return {
        label: "Placed",
        className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
        icon: Clock,
        iconColor: "text-blue-600",
        description: "Order received, awaiting processing",
      };
    case "SHIPPED":
      return {
        label: "Shipped",
        className: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100",
        icon: Truck,
        iconColor: "text-purple-600",
        description: "Order is on the way",
      };
    case "DELIVERED":
      return {
        label: "Delivered",
        className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
        icon: CheckCircle2,
        iconColor: "text-green-600",
        description: "Order successfully delivered",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
        icon: XCircle,
        iconColor: "text-red-600",
        description: "Order has been cancelled",
      };
    default:
      return {
        label: status,
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: Package,
        iconColor: "text-gray-600",
        description: "Unknown status",
      };
  }
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === status) return;

    startTransition(async () => {
      const { error } = await updateOrderStatusAction(orderId, newStatus);

      if (error) {
        toast.error("Failed to update status", {
          description: error.message || "Something went wrong",
        });
        return;
      }

      setStatus(newStatus);
      toast.success("Status updated", {
        description: `Order status changed to ${getStatusConfig(newStatus).label}`,
      });
    });
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  if (isPending) {
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
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
      disabled={isPending}
    >
      <SelectTrigger className="w-[150px] h-8 border-none shadow-none hover:bg-muted/50">
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
        {ORDER_STATUSES.map((s) => {
          const config = getStatusConfig(s);
          const Icon = config.icon;
          
          return (
            <SelectItem key={s} value={s}>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${config.iconColor}`} />
                <div className="flex flex-col">
                  <span className="font-medium">{config.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {config.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}