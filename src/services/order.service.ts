import api from '@/lib/api'

export interface OrderItem {
  medicineId: string
  quantity: number
  price: number
}

export interface CreateOrderData {
  items: OrderItem[]
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
}

export const orderService = {
  // Create order (Customer)
  create: async (data: CreateOrderData) => {
    const response = await api.post('/orders', data)
    return response.data
  },

  // Get customer's orders
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders')
    return response.data
  },

  // Get single order
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Get all orders (Admin)
  getAll: async (params?: { status?: string }) => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  // Get seller's orders
  getSellerOrders: async () => {
    const response = await api.get('/orders/seller-orders')
    return response.data
  },

  // Update order status (Seller/Admin)
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },

  // Add review (Customer)
  addReview: async (orderId: string, medicineId: string, data: {
    rating: number
    comment: string
  }) => {
    const response = await api.post(`/orders/${orderId}/review`, {
      medicineId,
      ...data,
    })
    return response.data
  },
}