import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
    initialized: false,
  }),

  actions: {
    setAuth(token, user = null) {
      this.token = token
      this.user = user
      this.isAuthenticated = true
      this.initialized = true
    },

    finishInit() {
      this.initialized = true
    },

    logout() {
      this.isAuthenticated = false
      this.token = null
      this.user = null
      this.initialized = false
      localStorage.removeItem('authToken')
    }
  },

  getters: {
    userId: (state) => state.user?.id || null,
  }
});