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
      const res = await fetch(`${API_URL}/review`, {
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
        error: { message: "Failed to create review" },
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
