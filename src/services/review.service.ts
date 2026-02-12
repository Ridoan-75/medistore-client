import { env } from "./../env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

// For creating a review
export interface CreateReviewPayload {
  medicineId: string;
  rating: number;
  comment?: string;
}

// What backend returns
export interface ReviewResponse {
  id: string;
  medicineId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export const reviewService = {
  createReview: async (payload: CreateReviewPayload) => {
    try {
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();
      
      // ✅ Check if cookies exist
      if (!cookieString) {
        return {
          data: null,
          error: { message: "Please login to submit a review" },
        };
      }

      const res = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieString,
        },
        credentials: "include", // ✅ Important for session cookies
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        
        // ✅ Handle specific authentication errors
        if (res.status === 401 || res.status === 403) {
          return {
            data: null,
            error: { message: "Please login to submit a review" },
          };
        }
        
        return {
          data: null,
          error: { message: error.message || "Failed to create review" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as ReviewResponse,
        error: null,
      };
    } catch (error) {
      console.error("Review creation error:", error);
      return {
        data: null,
        error: { message: "Failed to create review. Please try again." },
      };
    }
  },

  getMedicineReviews: async (medicineId: string) => {
    try {
      const res = await fetch(`${API_URL}/review/${medicineId}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        return {
          data: null,
          error: { message: "Failed to fetch reviews" },
        };
      }

      const response = await res.json();
      return {
        data: response.data as ReviewResponse[],
        error: null,
      };
    } catch (error) {
      console.error("Fetch reviews error:", error);
      return {
        data: null,
        error: { message: "Failed to fetch reviews" },
      };
    }
  },
};