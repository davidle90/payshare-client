<script setup>
import { ref, watch } from 'vue'
import { createExpense } from '@/services/expensesApiService'

const props = defineProps({
  showCreateExpenseModal: Boolean,
  groupId: String
})

const emit = defineEmits(['expenseCreated', 'modalClosed'])

const showModal = ref(props.showCreateExpenseModal)
const groupId = ref(props.groupId)

const expenseName = ref('');
const expenseDescription = ref('');
const expenseCategory = ref('');

const loading = ref(false)
const error = ref('')

watch(
  () => props.showCreateExpenseModal,
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

const handleCreateExpense = async () => {
  error.value = ''
  loading.value = true

  try {
    const expense = await createExpense(
      props.groupId,
      expenseName.value,
      expenseDescription.value,
      expenseCategory.value
    )

    emit('expenseCreated', expense)
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
          Create Expense
        </h3>
        <button @click="toggleModal" class="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <!-- Expense Input -->
      <div class="flex flex-col gap-4 mb-4">
        <input
          v-model="expenseName"
          type="text"
          placeholder="Expense name"
          class="w-full rounded border px-3 py-2 text-sm"
          :class="error ? 'border-red-500' : 'border-gray-300'"
          :disabled="loading"
        />
        <p v-if="error" class="mt-2 text-sm text-red-500">
          {{ error }}
        </p>

        <input
          v-model="expenseDescription"
          type="text"
          placeholder="Description"
          class="w-full rounded border px-3 py-2 text-sm"
          :class="error ? 'border-red-500' : 'border-gray-300'"
          :disabled="loading"
        />
        <p v-if="error" class="mt-2 text-sm text-red-500">
          {{ error }}
        </p>

        <input
          v-model="expenseCategory"
          type="text"
          placeholder="Category (Optional)"
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
        <button @click="handleCreateExpense" class="px-4 py-2 rounded bg-black text-white" :disabled="loading">
          <span v-if="loading">Creating...</span>
          <span v-else>Create</span>
        </button>
      </div>
    </div>
  </div>
</template>
