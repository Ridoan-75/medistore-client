import { cookies } from "next/headers";
import { env } from "./../env";

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

// ⭐ Helper function to get cookies properly
async function getCookieHeader() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Better-auth uses specific cookie names
  const sessionCookie = allCookies.find(
    c => c.name === 'better_auth.session_token' || c.name.includes('session')
  );
  
  if (!sessionCookie) {
    console.warn('No session cookie found');
    return '';
  }
  
  // Return all cookies as string
  return allCookies
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

// ⭐ Helper function for authenticated fetch
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const cookieHeader = await getCookieHeader();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        ...options.headers,
      },
      // ⭐ Important for server-side fetching
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const adminService = {
  getAllUsers: async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/user`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          data: null,
          error: { message: error.message || "Failed to get users" },
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
      const res = await fetchWithAuth(`${API_URL}/user/${id}/status`, {
        method: "PATCH",
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
      const res = await fetchWithAuth(`${API_URL}/order/all`, {
        method: "GET",
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
      const res = await fetchWithAuth(`${API_URL}/category`, {
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
      const res = await fetchWithAuth(`${API_URL}/category/${id}`, {
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
      const res = await fetchWithAuth(`${API_URL}/category/${id}`, {
        method: "DELETE",
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
      const cookieHeader = await getCookieHeader();
      
      console.log("Sending cookies:", cookieHeader);
      console.log("Payload:", payload);

      const res = await fetchWithAuth(`${API_URL}/category`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        return {
          data: null,
          error: { message: errorData.message || "Failed to create category" },
        };
      }

      const response = await res.json();
      console.log("Success response:", response);

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      console.error("Catch error:", error);
      return {
        data: null,
        error: { message: error.message || "Failed to create category" },
      };
    }
  },

  updateCategory: async (id: string, payload: CreateCategoryPayload) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/category/${id}`, {
        method: "PUT",
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