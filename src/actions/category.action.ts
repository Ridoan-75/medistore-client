"use server";

import { categoryService } from "../services/category.service";

export const allCategoriesAction = async () => {
  return categoryService.getAllCategories();
};
