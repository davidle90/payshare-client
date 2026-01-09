<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateAccount, deleteAccount, checkAuth } from '@/services/authApiService'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'

const authStore = useAuthStore()
const router = useRouter()

// Form fields
const username = ref(authStore.user.username)
const email = ref(authStore.user.email)
const password = ref('')
const confirmPassword = ref('')

// Toast & modal
const showToast = ref(false)
const showDeleteModal = ref(false)

// Validation errors
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

function showSavedToast() {
  showToast.value = true
  setTimeout(() => (showToast.value = false), 2000)
}

// Form validation
const isFormValid = () => {
  errors.value.username = username.value.trim() ? '' : 'Username is required'
  errors.value.email = email.value.trim() ? '' : 'Email is required'

  if (password.value) {
    errors.value.password = password.value.length < 8 ? 'Password must be atleast 8 characters' : '';
    errors.value.confirmPassword =
      confirmPassword.value
        ? password.value === confirmPassword.value
          ? ''
          : 'Passwords do not match'
        : 'Confirm password is required'
  } else {
    errors.value.password = ''
    errors.value.confirmPassword = ''
  }

  return !errors.value.username &&
         !errors.value.email &&
         !errors.value.password &&
         !errors.value.confirmPassword
}

// Update profile
const handleUpdateProfile = async () => {
  if (!isFormValid()) return

  try {
    const response = await updateAccount(username.value, email.value, password.value)
    if (response.success) {
      showSavedToast()
      password.value = ''
      confirmPassword.value = ''
      authStore.updateUser(response.data)
    }
  } catch (err) {
    console.error(err)
  }
}

// Delete account
const handleDeleteAccount = async () => {
  try {
    const response = await deleteAccount()
    if (response.success) {
      router.push('/logout')
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <BaseLayout>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Profile Settings</h2>

      <!-- Username -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Username</label>
        <input
          v-model="username"
          type="text"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">New Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Leave blank to keep current password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Re-enter password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center mt-6">
        <button
          :disabled="!isFormValid"
          @click="handleUpdateProfile"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>

        <button
          @click="showDeleteModal = true"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteAccount"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showToast"
        class="fixed inset-x-4 bottom-4 z-50
              mx-auto flex max-w-sm items-center gap-3
              rounded-xl bg-emerald-600 px-4 py-3
              text-base font-medium text-white
              shadow-xl
              sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        <span class="text-xl">✅</span>
        <span>Saved successfully</span>
      </div>
    </transition>
  </BaseLayout>
</template>
