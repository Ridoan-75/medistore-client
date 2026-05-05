import { env } from "./../env";
import { getAuthToken } from "@/src/lib/auth";

const API_URL = env.API_URL;

export const userService = {
  // Get current user info from DB (role, status, etc.)
  getMe: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { data: null, error: { message: "Not authenticated" } };
      }

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        return { data: null, error: { message: "Failed to fetch user" } };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Failed to fetch user" } };
    }
  },
};
