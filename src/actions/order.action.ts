"use server";

import { CreateOrderPayload, orderService } from "../services/order.service";

export const createOrderAction = async (payload: CreateOrderPayload) => {
  return orderService.createOrder(payload);
};

export const getUserOrdersAction = async () => {
  return orderService.getUserOrders();
};

export const trackOrderStatusAction = async (orderId: string) => {
  return orderService.trackOrderStatus(orderId);
};
