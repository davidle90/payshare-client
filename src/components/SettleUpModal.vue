<script setup>
import { ref, watch } from 'vue'
import { createExpense } from '@/services/expensesApiService'

const props = defineProps({
  showSettleUpModal: Boolean,
  groupId: String
})

const emit = defineEmits(['expensesSettled', 'modalClosed'])

const showModal = ref(props.showSettleUpModal)
const groupId = ref(props.groupId)

const loading = ref(false)
const error = ref('')

watch(
  () => props.showSettleUpModal,
  (newValue) => {
    showModal.value = newValue
  }
)

const toggleModal = () => {
  showModal.value = !showModal.value

  if(showModal.value == false){
    emit('modalClosed')
  }
}

const handleSettleUp = async () => {
  error.value = ''
  loading.value = true

  try {
    //const expense = await createExpense()
    emit('expensesSettled')
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
          Settle Up
        </h3>
        <button @click="toggleModal" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="mb-4">
        <p>Settle up!</p>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3">
        <button @click="toggleModal" class="px-4 py-2 rounded bg-gray-200" :disabled="loading">
          Cancel
        </button>
        <button @click="handleSettleUp" class="px-4 py-2 rounded bg-black text-white" :disabled="loading">
          <span v-if="loading">Updating...</span>
          <span v-else>Settle</span>
        </button>
      </div>
    </div>
  </div>
</template>
