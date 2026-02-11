"use server";

import {
  CreateProductPayload,
  sellerProductService,
} from "../services/seller.service";

export const createProductAction = async (payload: CreateProductPayload) => {
  return await sellerProductService.createProduct(payload);
};

export const getSellerProductsAction = async () => {
  return await sellerProductService.getSellerProducts();
};

export const deleteProductAction = async (id: string) => {
  return await sellerProductService.deleteProduct(id);
};

export const updateProductAction = async (
  id: string,
  payload: Partial<CreateProductPayload>,
) => {
  return await sellerProductService.updateProduct(id, payload);
};

export const getProductByIdAction = async (id: string) => {
  return await sellerProductService.getProductById(id);
};

export const updateOrderStatusAction = async (
  orderId: string,
  status: string,
) => {
  return await sellerProductService.updateOrderStatus(orderId, status);
};
