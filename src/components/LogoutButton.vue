<script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const logout = () => {
    authStore.logout()
    router.push({path: '/'})
  }

</script>

<template>
  <button>
    <router-link to="/logout" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition">
      Logout
    </router-link>
  </button>
</template>