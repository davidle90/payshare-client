import apiClient from './baseApiService.js'
import { useAuthStore } from '../stores/auth.js'

export const register = async (username, email, password) => {
  try {
    const form = {
      username,
      email,
      password
    }

    const authStore = useAuthStore()
    const response = await apiClient.post('/auth/register', form)

    const token = response.data.access_token
    localStorage.setItem('authToken', token)
    authStore.setAuth(token, response.data.user)

    return { success: true, message: "Authenticated" }
  } catch (error) {
    if (error.response && (error.response.status === 422 || error.response.status === 401)) {
      return { success: false, message: 'Invalid email or password.' }
    } else {
      return { success: false, message: 'Registration failed: ' + error.message }
    }
  }
}

export const login = async (email, password) => {
  try {
    const form = {
      email,
      password
    }

    const authStore = useAuthStore()

    const response = await apiClient.post('/auth/login', form)

    const token = response.data.access_token
    const user = response.data.user
    localStorage.setItem('authToken', token)
    authStore.setAuth(token, user)

    return { success: true, message: "Authenticated" }
  } catch (error) {
    if (error.response && (error.response.status === 422 || error.response.status === 401)) {
      return { success: false, message: 'Invalid email or password.' }
    } else {
      return { success: false, message: 'Login failed: ' + error.message }
    }
  }
}

export const checkAuth = async () => {
  try {
    const authStore = useAuthStore()

    const response = await apiClient.get('/auth/check', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    return { success: true, message: response.data.message, user: response.data.user }
  } catch (error) {
    return { success: false, message: 'Error while doing auth check: ' + error.message }
  }
}

export const updateAccount = async (username = null, email = null, password = null) => {
  try {
    const data = {
      username,
      email,
      password,
    }

    await apiClient.patch('/users/me', data)

    return { success: true }
  } catch (error) {
    return { success: false, message: 'Error while updating account: ' + error.message }
  }
}

export const deleteAccount = async () => {
  try {
    const response = await apiClient.delete('/users/me');
    return { success: response.status === 200};
  } catch (error) {
    console.log('Failed to delete account:', error);
    throw error;
  }
}