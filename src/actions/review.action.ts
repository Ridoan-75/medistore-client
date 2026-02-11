"use server";

import { CreateReviewPayload, reviewService } from "../services/review.service";

export const createReviewAction = async (payload: CreateReviewPayload) => {
  return reviewService.createReview(payload);
};

export const getMedicineReviewsAction = async (medicineId: string) => {
  return reviewService.getMedicineReviews(medicineId);
};
