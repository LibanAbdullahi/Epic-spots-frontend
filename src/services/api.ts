import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
}

export const spotsAPI = {
  getAll: () => api.get('/spots'),
  getById: (id: string) => api.get(`/spots/${id}`),
  create: (data: any) => api.post('/spots', data),
  update: (id: string, data: any) => api.put(`/spots/${id}`, data),
  delete: (id: string) => api.delete(`/spots/${id}`),
}

export const bookingsAPI = {
  getMyBookings: () => api.get('/bookings/my-bookings'),
  create: (data: any) => api.post('/bookings', data),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
}

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getOwnerDashboard: () => api.get('/users/owner/dashboard'),
  getOwnerSpots: () => api.get('/users/owner/spots'),
} 