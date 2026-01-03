<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { checkAuth } from './services/authApiService.js'

const authStore = useAuthStore()

onMounted(async () => {
  const token = localStorage.getItem('authToken')

  if (token) {
    authStore.token = token

    try {
      const response = await checkAuth()

      if (response.success) {
        authStore.setAuth(token, response.user)
      } else {
        authStore.logout()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      authStore.logout()
    }
  } else {
    authStore.isAuthenticated = false
  }

  authStore.finishInit()

})
</script>

<template>
  <router-view />
</template>
