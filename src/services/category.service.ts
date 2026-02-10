import api from '@/lib/api'

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  medicineCount?: number
}

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Create category (Admin)
  create: async (data: { name: string; description: string; icon?: string }) => {
    const response = await api.post('/categories', data)
    return response.data
  },

  // Update category (Admin)
  update: async (id: string, data: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  // Delete category (Admin)
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}