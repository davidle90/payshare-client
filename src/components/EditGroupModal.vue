<script setup>
import { ref, watch } from 'vue'
import { updateGroup } from '@/services/groupsApiService'

const props = defineProps({
  showEditGroupModal: Boolean,
  groupName: String,
  groupId: String
})

const emit = defineEmits(['groupUpdated', 'modalClosed'])

const showModal = ref(props.showEditGroupModal)
const groupName = ref(props.groupName)
const loading = ref(false)
const error = ref('')

watch(
  () => props.showEditGroupModal,
  (newValue) => {
    showModal.value = newValue
  }
)

watch(
  () => props.groupName,
  (newGroupName) => {
    groupName.value = newGroupName 
  }
)

const toggleModal = () => {
  showModal.value = !showModal.value

  if(showModal.value == false){
    emit('modalClosed')
  }
}

const handleUpdateGroup = async () => {
  if (!groupName.value.trim()) {
    error.value = 'Group name is required'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const group = await updateGroup(props.groupId, groupName.value)
    emit('groupUpdated', group)
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
          Edit Group
        </h3>
        <button @click="toggleModal" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <!-- Group Name Input -->
      <div class="mb-4">
        <input
          v-model="groupName"
          type="text"
          placeholder="Group name"
          class="w-full rounded border px-3 py-2 text-sm"
          :class="error ? 'border-red-500' : 'border-gray-300'"
          :disabled="loading"
        />
        <p v-if="error" class="mt-2 text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-4 py-2 rounded bg-gray-200" :disabled="loading">
          Cancel
        </button>
        <button @click="handleUpdateGroup" class="px-4 py-2 rounded bg-black text-white" :disabled="loading">
          <span v-if="loading">Updating...</span>
          <span v-else>Update</span>
        </button>
      </div>
    </div>
  </div>
</template>
