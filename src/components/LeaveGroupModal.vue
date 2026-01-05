<script setup>
import { ref, watch } from 'vue'
import { leaveGroup } from '@/services/groupsApiService'
import { jwtDecode } from 'jwt-decode'

const props = defineProps({
  showLeaveGroupModal: Boolean,
  group: Object
})

const emit = defineEmits(['groupLeft', 'modalClosed'])
const token = localStorage.getItem('authToken')
const userId = token ? jwtDecode(token).sub : ''

const memberId = ref(null);

const showModal = ref(props.showLeaveGroupModal)
const loading = ref(false)
const error = ref('')

watch(
  () => props.showLeaveGroupModal,
  (newValue) => {
    showModal.value = newValue 
  }
)

watch(
  () => props.group,
  (newValue) => {
    const members = newValue.members;
    const userMember = members.find(m => m.user.id == userId);

    if(!userMember) return;

    memberId.value = userMember.id;
  }
)

const toggleModal = () => {
  showModal.value = !showModal.value

  if(showModal.value == false){
    emit('modalClosed')
  }
}

const handleLeaveGroup = async () => {
  if (!props.group?.referenceId || !memberId.value) {
    error.value = 'Error while leaving group'
    return
  }

  error.value = ''
  loading.value = true

  try {
    await leaveGroup(props.group.referenceId, memberId.value)
    emit('groupLeft')
    toggleModal()
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="toggleModal"
  >
    <div class="w-full max-w-md rounded-lg bg-white shadow-lg p-6">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Leave Group
        </h3>
        <button @click="toggleModal" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <!-- Group Name Input -->
      <div class="mb-4">
        <p class="py-4">
          Do you want to leave <span class="font-semibold">{{ group.name }}</span>?
        </p>
        <p v-if="error" class="mt-2 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-4 py-2 rounded bg-gray-200" :disabled="loading">
          Cancel
        </button>
        <button @click="handleLeaveGroup" class="px-4 py-2 rounded bg-black text-white" :disabled="loading">
          <span v-if="loading">Leaving...</span>
          <span v-else>Leave</span>
        </button>
      </div>
    </div>
  </div>
</template>
