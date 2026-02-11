import { env } from "./../env";
import { cookies } from "next/headers";

export interface CreateOrderItemPayload {
  medicineId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  phone: string;
  shippingAddress: string;
  orderItems: CreateOrderItemPayload[];
}

export interface Medicine {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  sellerId: string;
  quantity: number;
  price: string;
  createdAt: string;
  updatedAt: string;
  medicine: Medicine;
}

export interface Order {
  id: string;
  userId: string;
  phone: string;
  shippingAddress: string;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

const API_URL = env.API_URL;

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieStore.toString(),
        },

        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to create order" },
        };
      }

      const response = await res.json();
      console.log(response);
      return {
        data: response.data as Order,
        error: null,
      };
    } catch (error) {
      console.error("Order creation error:", error);
      return {
        data: null,
        error: { message: "Failed to create order" },
      };
    }
  },

  getUserOrders: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/order`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch orders" },
        };
      }

      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.error("Fetch orders error:", error);
      return {
        data: null,
        error: { message: "Failed to fetch orders" },
      };
    }
  },

  trackOrderStatus: async (orderId: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch order status" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as { status: Order["status"] },
        error: null,
      };
    } catch (error) {
      console.error("Fetch order status error:", error);
      return {
        data: null,
        error: { message: "Failed to fetch order status" },
      };
    }
  },
};
