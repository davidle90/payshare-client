<script setup>
import { joinGroup } from '@/services/groupsApiService'
import { jwtDecode } from 'jwt-decode'
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['groupJoined'])

const token = localStorage.getItem('authToken')
const userId = token ? jwtDecode(token).sub : ''

const showModal = ref(false)
const groupReferenceId = ref('')
const loading = ref(false)
const error = ref('')

const toggleModal = () => {
  showModal.value = !showModal.value
  error.value = ''
  groupReferenceId.value = ''
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showModal.value) {
    toggleModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleJoinGroup = async () => {
  if (!groupReferenceId.value.trim()) {
    error.value = 'Group ID is required'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const group = await joinGroup(groupReferenceId.value, userId);
    emit('groupJoined', group)

    toggleModal()
  } catch (err) {
    error.value = err.response.data.message
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <button
    @click="toggleModal"
    class="px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-800"
  >
    Join group
  </button>

  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="toggleModal"
  >
    <div class="w-full max-w-md rounded-lg bg-white shadow-lg p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Join group
        </h3>
        <button
          @click="toggleModal"
          class="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div class="mb-4">
        <input
          v-model="groupReferenceId"
          type="text"
          placeholder="Group ID"
          class="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          :class="error ? 'border-red-500' : 'border-gray-300'"
          :disabled="loading"
        />

        <p v-if="error" class="mt-2 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="toggleModal"
          class="px-4 py-2 rounded bg-gray-200 text-sm hover:bg-gray-300"
          :disabled="loading"
        >
          Cancel
        </button>

        <button
          @click="handleJoinGroup"
          class="px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          :disabled="loading"
        >
          <span v-if="loading">Joining...</span>
          <span v-else>Join</span>
        </button>
      </div>
    </div>
  </div>
</template>
