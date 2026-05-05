import { env } from "./../env";
import { getAuthToken } from "@/src/lib/auth";

const API_URL = env.API_URL;

export interface OrderMedicine {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  sellerId: string;
  status: string;
  manufacturer: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSeller {
  id: string;
  name: string;
  phone: string | null;
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
  medicine: OrderMedicine;
  seller: OrderSeller;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface SellerOrder {
  id: string;
  userId: string;
  totalAmount: string;
  status: "PLACED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  phone: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: OrderUser;
}

export interface SellerProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  categoryId: string;
  sellerId: string;
  status: string;
  manufacturer?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
  manufacturer?: string;
}

export interface OrderStatus {
  PLACED: string;
  PROCESSING: string;
  SHIPPED: string;
  DELIVERED: string;
  CANCELLED: string;
}

// Helper: build auth header from Firebase token
async function authHeader(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const sellerProductService = {
  getSellerProducts: async () => {
    try {
      const res = await fetch(`${API_URL}/medicine/seller`, {
        headers: { ...(await authHeader()) },
        cache: "no-store",
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to fetch products" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as SellerProduct[],
        error: null,
      };
    } catch (error) {
      console.error("Fetch products error:", error);
      return {
        data: null,
        error: { message: "Failed to fetch products" },
      };
    }
  },

  createProduct: async (payload: CreateProductPayload) => {
    try {
      const res = await fetch(`${API_URL}/medicine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeader()),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to create product" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as SellerProduct,
        error: null,
      };
    } catch (error) {
      console.error("Create product error:", error);
      return {
        data: null,
        error: { message: "Failed to create product" },
      };
    }
  },

  updateProduct: async (id: string, payload: Partial<CreateProductPayload>) => {
    try {
      const res = await fetch(`${API_URL}/medicine/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeader()),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to update product" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as SellerProduct,
        error: null,
      };
    } catch (error) {
      console.error("Update product error:", error);
      return {
        data: null,
        error: { message: "Failed to update product" },
      };
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/medicine/${id}`, {
        method: "DELETE",
        headers: { ...(await authHeader()) },
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to delete product" },
        };
      }

      return {
        data: { success: true },
        error: null,
      };
    } catch (error) {
      console.error("Delete product error:", error);
      return {
        data: null,
        error: { message: "Failed to delete product" },
      };
    }
  },

  getProductById: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/medicine/${id}`, {
        headers: { ...(await authHeader()) },
        cache: "no-store",
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to fetch product" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as SellerProduct,
        error: null,
      };
    } catch (error) {
      console.error("Fetch product error:", error);
      return {
        data: null,
        error: { message: "Failed to fetch product" },
      };
    }
  },

  getSellerOrders: async () => {
    try {
      const res = await fetch(`${API_URL}/order/seller`, {
        headers: { ...(await authHeader()) },
        cache: "no-store",
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to fetch seller orders" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as SellerOrder[],
        error: null,
      };
    } catch (error) {
      console.error("Fetch seller orders error:", error);
      return {
        data: null,
        error: { message: "Failed to fetch seller orders" },
      };
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeader()),
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to update order status" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as SellerOrder,
        error: null,
      };
    } catch (error) {
      console.error("Update order status error:", error);
      return {
        data: null,
        error: { message: "Failed to update order status" },
      };
    }
  },
};
