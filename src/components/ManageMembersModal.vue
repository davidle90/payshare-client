<script setup>
import { ref, watch } from 'vue'
import { removeGroupMembers } from '@/services/groupsApiService'
import { jwtDecode } from 'jwt-decode'

const props = defineProps({
  showMembersModal: Boolean,
  group: Object
})

const emit = defineEmits(['membersUpdated', 'modalClosed'])

const token = localStorage.getItem('authToken')
const userId = token ? jwtDecode(token).sub : ''
const userMember = ref(null);

const groupMembers = ref([]);
const selectedMembers = ref([]);
const canUpdate = ref(false);

const showModal = ref(props.showMembersModal)
const loading = ref(false)
const error = ref('')

const confirmRemoval = ref(false);

watch(
  () => props.showMembersModal,
  (newValue) => {
    showModal.value = newValue 
  }
)

watch(
  () => props.group,
  (newValue) => {
    groupMembers.value = newValue.members;
    userMember.value = groupMembers.value.find(m => m.user.id == userId);

    if (!userMember) return;
    canUpdate.value = userMember.value.role === 'owner'
  }
)

const toggleModal = () => {
  showModal.value = !showModal.value
  confirmRemoval.value = false;

  if(showModal.value == false){
    emit('modalClosed')
  }
}

const handleUpdateMembers = async () => {
  if (!props.group?.referenceId || selectedMembers.value.length <= 0) {
    return
  }

  error.value = ''
  loading.value = true

  try {
    
    const selectedMemberIds = selectedMembers.value.map(member => member.id);

    await removeGroupMembers(props.group.referenceId, selectedMemberIds)
    emit('membersUpdated', selectedMemberIds)
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
          Members
        </h3>
        <button @click="toggleModal" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div v-if="confirmRemoval" class="mb-8">
        <p class="mb-2">Are you sure you want to remove following members from the group:</p>
        <ul>
          <li v-for="selectedMember in selectedMembers" :key="selectedMember.id" class="font-semibold">
            {{ selectedMember.user.username }}
          </li>
        </ul>
      </div>
      <div v-else class="mb-8">
        <div v-for="groupMember in groupMembers" :key="groupMember.id" class="flex items-center mb-2">
          <input
            type="checkbox"
            :value="groupMember"
            v-model="selectedMembers"
            :disabled="userMember.id == groupMember.id"
            class="mr-2 h-4 w-4 border-gray-300 rounded"
          >
          <span class="text-sm text-gray-700" :class="{ 'font-semibold': userMember.id == groupMember.id }">
            {{ groupMember.user.username }}
          </span>
        </div>
      </div>

      <!-- Modal Footer -->
      <div v-if="canUpdate && !confirmRemoval" class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-3 py-1 rounded bg-gray-200 cursor-pointer" :disabled="loading">
          Cancel
        </button>
        <button @click="confirmRemoval = true" :class="[canUpdate ? 'bg-black cursor-pointer' : 'bg-gray-600','px-3 py-1 rounded text-white']" :disabled="loading || !canUpdate">
          <span>Remove Selected Members</span>
        </button>
      </div>

      <div v-else-if="canUpdate && confirmRemoval" class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-3 py-1 rounded bg-gray-200 cursor-pointer" :disabled="loading">
          Cancel
        </button>
        <button @click="handleUpdateMembers" :class="[canUpdate ? 'bg-red-500 cursor-pointer' : 'bg-gray-600','px-3 py-1 rounded text-white']" :disabled="loading || !canUpdate">
          <span v-if="loading">Removing...</span>
          <span v-else>Yes, remove</span>
        </button>
      </div>

      <div v-else class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-3 py-1 rounded bg-black text-white cursor-pointer" :disabled="loading">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
