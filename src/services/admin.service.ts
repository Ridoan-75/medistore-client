import { cookies } from "next/headers";
import { env } from "./../env";
import { de } from "date-fns/locale";
import { create } from "domain";

const API_URL = env.API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  status: string;
}

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface getProductParam {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
  imageUrl?: string;
}

export const adminService = {
  getAllUsers: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
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
        data: response.data as User[],
        error: null,
      };
    } catch (error) {
      console.error("Get all users error:", error);
      return {
        data: null,
        error: { message: "Failed to get all users" },
      };
    }
  },

  updateUserStatus: async (id: string, status: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/user/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to update user status" },
        };
      }
      const response = await res.json();
      return {
        data: response.data as User,
        error: null,
      };
    } catch (error) {
      console.error("Update user status error:", error);
      return {
        data: null,
        error: { message: "Failed to update user status" },
      };
    }
  },

  getAllProduct: async (params?: getProductParam, options?: ServiceOptions) => {
    try {
      const url = new URL(`${API_URL}/medicine`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value);
          }
        });
      }

      const config: RequestInit = {};
      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      config.next = { ...config.next, tags: ["medicines"] };

      const res = await fetch(url.toString(), config);

      const medicines = await res.json();

      return {
        data: medicines,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to fetch featured products" },
      };
    }
  },

  getAllOrders: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/order/all`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to fetch all orders" },
        };
      }

      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to fetch all orders" },
      };
    }
  },

  getAllCategories: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/category`, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch categories" },
        };
      }
      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to fetch categories" },
      };
    }
  },

  getCategoriesbyId: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/category/${id}`, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch category" },
        };
      }
      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to fetch category" },
      };
    }
  },

  deleteCategorybyId: async (id: string) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/category/${id}`, {
        method: "DELETE",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to delete category" },
        };
      }
      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to delete category" },
      };
    }
  },

  createCategory: async (payload: CreateCategoryPayload) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to create category" },
        };
      }
      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to create category" },
      };
    }
  },

  updateCategory: async (id: string, payload: CreateCategoryPayload) => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to update category" },
        };
      }
      const response = await res.json();
      return {
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to update category" },
      };
    }
  },
};
