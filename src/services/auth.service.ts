import api from '@/lib/api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role: 'customer' | 'seller'
}

export const authService = {
  // Login
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  // Register
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}