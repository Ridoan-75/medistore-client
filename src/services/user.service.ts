import api from '@/lib/api'

export const userService = {
  // Get all users (Admin)
  getAll: async (params?: { role?: string, status?: string }) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  // Update profile
  updateProfile: async (data: {
    name?: string
    phone?: string
    address?: string
  }) => {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    const response = await api.put('/users/password', data)
    return response.data
  },

  // Ban/Unban user (Admin)
  banUser: async (userId: string) => {
    const response = await api.patch(`/users/${userId}/ban`)
    return response.data
  },

  unbanUser: async (userId: string) => {
    const response = await api.patch(`/users/${userId}/unban`)
    return response.data
  },
}