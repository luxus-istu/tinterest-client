import axios from 'axios'

/**
 * Centralized Axios instance for communicating with the Spring backend.
 * Requests to /api are proxied to the backend via next.config.ts.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to attach auth tokens (JWT)
api.interceptors.request.use(
  (config) => {
    // TODO: Retrieve token from global state or localStorage
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // TODO: Handle logout or refresh token logic
    }
    return Promise.reject(error)
  }
)

export default api
