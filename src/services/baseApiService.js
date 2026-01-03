import axios from 'axios'
import { useAuthStore } from '../stores/auth.js'

const API_URL = import.meta.env.VITE_PAYSHARE_API_URL
const API_KEY = import.meta.env.VITE_PAYSHARE_API_KEY
const BASE_URL = API_URL.endsWith('/') ? `${API_URL}api/v1` : `${API_URL}/api/v1`

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers['Authorization'] = `Bearer ${authStore.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default apiClient
