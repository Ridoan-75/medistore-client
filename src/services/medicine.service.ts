import api from '@/lib/api'

export interface Medicine {
  id: string
  name: string
  category: string
  manufacturer: string
  price: number
  stock: number
  description: string
  specifications?: string
  image: string
  sellerId: string
  createdAt: string
  updatedAt: string
}

export interface CreateMedicineData {
  name: string
  category: string
  manufacturer: string
  price: number
  stock: number
  description: string
  specifications?: string
  image?: File
}

export const medicineService = {
  // Get all medicines (with filters)
  getAll: async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
  }) => {
    const response = await api.get('/medicines', { params })
    return response.data
  },

  // Get single medicine
  getById: async (id: string) => {
    const response = await api.get(`/medicines/${id}`)
    return response.data
  },

  // Create medicine (Seller)
  create: async (data: CreateMedicineData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value)
      }
    })
    
    const response = await api.post('/medicines', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Update medicine (Seller)
  update: async (id: string, data: Partial<CreateMedicineData>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value)
      }
    })
    
    const response = await api.put(`/medicines/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // Delete medicine (Seller)
  delete: async (id: string) => {
    const response = await api.delete(`/medicines/${id}`)
    return response.data
  },

  // Get seller's medicines
  getMyMedicines: async () => {
    const response = await api.get('/medicines/my-medicines')
    return response.data
  },
}