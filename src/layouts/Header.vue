<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const router = useRouter()
const showDropdown = ref(false)

const toggleDropdown = () => (showDropdown.value = !showDropdown.value)
const handleLogout = async () => {
  router.push('/logout')
}
</script>

<template>
  <div class="flex justify-between items-center px-6 py-3 bg-white shadow" @click.self="toggleDropdown">
    <!-- Logo -->
    <router-link to="/" class="text-2xl font-bold text-gray-800">
      PAYSHARE
    </router-link>

    <!-- User menu -->
    <div class="relative">
      <div v-if="isAuthenticated">
        <button
          @click="toggleDropdown"
          class="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span class="font-medium">{{ user?.username }}</span>
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 animate-fade-in"
        >
          <router-link
            to="/dashboard"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            @click="showDropdown = false"
          >
            Dashboard
          </router-link>
          <router-link
            to="/profile"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            @click="showDropdown = false"
          >
            Profile
          </router-link>
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div v-else>
        <router-link
          to="/login"
          class="font-semibold text-blue-600 hover:text-blue-800"
        >
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
