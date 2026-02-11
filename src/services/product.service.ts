import { env } from "./../env";

const API_URL = env.API_URL;

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

export const productService = {
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

  // getProductById
  getProductById: async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/medicine/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch product details" },
        };
      }
      const response = await res.json();
      const medicines = response?.data || null;
      return {
        data: medicines,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error: { message: "Failed to fetch product details" },
      };
    }
  },
};
