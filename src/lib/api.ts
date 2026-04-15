import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 and 403 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log more details for 400 errors to help debugging
    if (error.response?.status === 400) {
      console.error('❌ API 400 Bad Request:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data ? JSON.parse(error.config.data) : null,
        error: error.response?.data
      })
    }

    // Only redirect on 401 (unauthorized/token expired), NOT on 403 (forbidden)
    if (error.response?.status === 401) {
      // Don't redirect on login page itself
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
