"use server";

import { CreateReviewPayload, reviewService } from "../services/review.service";
import { userService } from "../services/user.service";

export const createReviewAction = async (payload: CreateReviewPayload) => {
  // ✅ Check session first
  const sessionResult = await userService.getSession();
  
  if (!sessionResult?.data?.user?.id) {
    return {
      data: null,
      error: {
        message: "Please login to submit a review",
      },
    };
  }

  // ✅ Call service
  return reviewService.createReview(payload);
};

export const getMedicineReviewsAction = async (medicineId: string) => {
  return reviewService.getMedicineReviews(medicineId);
};