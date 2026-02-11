"use server";

import { adminService, CreateCategoryPayload } from "../services/admin.service";

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

export const getAllUsersAction = async () => {
  return adminService.getAllUsers();
};

export const updateUserStatusAction = async (id: string, status: string) => {
  return adminService.updateUserStatus(id, status);
};

export const getAllProductsAction = async (
  params?: getProductParam,
  options?: ServiceOptions,
) => {
  return adminService.getAllProduct(params, options);
};

export const getAllOrdersAction = async () => {
  return adminService.getAllOrders();
};

export const getAllCategoriesAction = async () => {
  return adminService.getAllCategories();
};

export const getCategoriesbyIdAction = async (id: string) => {
  return adminService.getCategoriesbyId(id);
};
export const deleteCategorybyIdAction = async (id: string) => {
  return adminService.deleteCategorybyId(id);
};

export const createCategoryAction = async (payload: CreateCategoryPayload) => {
  return adminService.createCategory(payload);
};
export const updateCategoryAction = async (
  id: string,
  payload: CreateCategoryPayload,
) => {
  return adminService.updateCategory(id, payload);
};
