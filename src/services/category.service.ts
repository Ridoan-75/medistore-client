import { cookies } from "next/headers";
import { env } from "./../env";

const API_URL = env.API_URL;

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// ⭐ Helper function to get cookies
async function getCookieHeader() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  return allCookies
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

export const categoryService = {
  getAllCategories: async () => {
    try {
      const cookieHeader = await getCookieHeader();
      
      const res = await fetch(`${API_URL}/category`, {
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ⭐ Important
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch categories" },
        };
      }

      const response = await res.json();
      const categories: Category[] = response?.data || [];

      return {
        data: categories,
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
};