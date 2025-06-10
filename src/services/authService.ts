import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'USER' | 'OWNER'
}

export const authService = {
  // Authentication
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginCredentials) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  
  // Password management
  forgotPassword: (email: string) => api.post('/password/forgot', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/password/reset', { token, newPassword }),
  verifyResetToken: (token: string) => api.get(`/password/verify-reset-token/${token}`),
  changePassword: (currentPassword: string, newPassword: string) => api.put('/password/change', { currentPassword, newPassword }),
  
  // OAuth
  googleLogin: () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
    window.location.href = `${apiUrl}/auth/google`
  },
  
  // Session management
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }
} 