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
  ChevronDown,
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
  iconColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  hoverBg: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PLACED: {
    icon: Clock,
    label: "Placed",
    iconColor: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-700",
    hoverBg: "hover:bg-slate-100",
  },
  PROCESSING: {
    icon: Box,
    label: "Processing",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    hoverBg: "hover:bg-amber-100",
  },
  SHIPPED: {
    icon: Truck,
    label: "Shipped",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    hoverBg: "hover:bg-blue-100",
  },
  DELIVERED: {
    icon: CheckCircle,
    label: "Delivered",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    hoverBg: "hover:bg-emerald-100",
  },
  CANCELLED: {
    icon: XCircle,
    label: "Cancelled",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    hoverBg: "hover:bg-rose-100",
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
        className={`
          w-[160px] h-10 
          ${config.bgColor} 
          ${config.borderColor} 
          ${config.textColor}
          ${config.hoverBg}
          border-2 rounded-xl 
          font-semibold text-sm
          shadow-sm
          transition-all duration-200
          focus:ring-2 focus:ring-offset-2 focus:ring-${config.borderColor}
          ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {isPending ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${config.iconColor}`} />
              <SelectValue />
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        )}
      </SelectTrigger>

      <SelectContent className="min-w-[160px] border-2 rounded-xl shadow-lg">
        {ORDER_STATUSES.map((orderStatus) => {
          const statusConfig = STATUS_CONFIG[orderStatus];
          const Icon = statusConfig.icon;
          const isSelected = orderStatus === status;

          return (
            <SelectItem
              key={orderStatus}
              value={orderStatus}
              className={`
                cursor-pointer rounded-lg my-1 mx-1
                ${statusConfig.hoverBg}
                ${isSelected ? statusConfig.bgColor : ""}
                transition-colors duration-150
              `}
            >
              <div className="flex items-center gap-2.5 py-1">
                <div className={`
                  p-1.5 rounded-lg
                  ${statusConfig.bgColor}
                  ${statusConfig.borderColor}
                  border
                `}>
                  <Icon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                </div>
                <span className={`font-semibold ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}