<script setup>
import BaseLayout from '@/layouts/BaseLayout.vue';
import { createContributor, createParticipant, deleteExpense, finalizeExpense, getExpense, updateContributor, updateExpense, updateParticipant } from '@/services/expensesApiService';
import { getGroupMembers } from '@/services/groupsApiService';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TrashIcon } from '@heroicons/vue/24/solid'

const route = useRoute();
const router = useRouter();

const groupId = route.params.groupId;
const expenseId = route.params.expenseId;
const isFinalized = ref(false);
const loading = ref(false)
const errorMessage = ref('')

const members = ref([]); // Store group members
const expense = ref({
  name: '',
  description: '',
  category: '',
  totalAmount: 0,
  status: '', // Read-only
  participants: [],
  contributors: []
});
const expenseCopy = ref({});

const contributors = ref([]); // Local contributors array
const participants = ref([]); // Local participants array

const showDeleteModal = ref(false);

onMounted(async () => {
  await loadComponentData();
});

const toggleDeleteModal = () => {
    showDeleteModal.value = !showDeleteModal.value;
}

const loadComponentData = async () => {
   // Fetch expense details and group members
  expense.value = await getExpense(expenseId);
  members.value = await getGroupMembers(groupId);
  isFinalized.value = expense.value.status === 'finalized'
  expenseCopy.value = expense.value;

  // Initialize participants and contributors arrays based on members
  members.value.forEach(member => {
    // Initialize empty amounts for each member
    participants.value.push({
      id: null,
      memberId: member.id,
      amountOwed: 0
    });
    contributors.value.push({
      id: null,
      memberId: member.id,
      amountPaid: 0
    });
  });

  // Pre-fill participants and contributors arrays with data from expense
  expense.value.participants.forEach(participant => {
    const participantIndex = participants.value.findIndex(
      p => p.memberId === participant.memberId
    );
    if (participantIndex !== -1) {
      participants.value[participantIndex].amountOwed = parseFloat(participant.amountOwed);
      participants.value[participantIndex].id = participant.id;
    }
  });

  expense.value.contributors.forEach(contributor => {
    const contributorIndex = contributors.value.findIndex(
      c => c.memberId === contributor.memberId
    );
    if (contributorIndex !== -1) {
      contributors.value[contributorIndex].amountPaid = parseFloat(contributor.amountPaid);
      contributors.value[contributorIndex].id = contributor.id;
    }
  });
}

// Update functions for adding participants, contributors, and saving
const handleUpdateParticipant = (memberId, amount, id) => {
  const existing = participants.value.find(p => p.memberId === memberId);
  if (existing) {
    existing.amountOwed = amount;
  } else {
    if (!amount || amount === 0) {
      return;
    }
    participants.value.push({ memberId, amountOwed: amount, id });
  }
};

const handleUpdateContributor = (memberId, amount, id) => {
  const existing = contributors.value.find(p => p.memberId === memberId);
  if (existing) {
    existing.amountPaid = amount;
  } else {
    if (!amount || amount === 0) {
      return;
    }
    contributors.value.push({ memberId, amountPaid: amount, id });
  }
};

const saveExpense = async (reload = true) => {
  loading.value = true;
  errorMessage.value = '';
  const oldExpense = expense.value;

  if(expenseCopy.value !== expense.value) {
    const updatedExpense = await updateExpense(
      expenseId,
      expense.value.name,
      expense.value.description,
      expense.value.category
    );

    expense.value = updatedExpense;
  }

  // Update participants and contributors after saving expense
  for (const participant of participants.value) {
    const existingParticipant = oldExpense.participants.find(p => p.memberId === participant.memberId);
    
    if (existingParticipant) {
      if (existingParticipant.amountOwed !== participant.amountOwed) {
        await updateParticipant(expenseId, participant.id, participant.amountOwed);
      }
    } else {
      if (participant.amountOwed > 0) {
        await createParticipant(expenseId, participant.memberId, participant.amountOwed);
      }
    }
  }

  for (const contributor of contributors.value) {
    const existingContributor = oldExpense.contributors.find(c => c.memberId === contributor.memberId);
    
    if (existingContributor) {
      if (existingContributor.amountPaid !== contributor.amountOwed) {
        await updateContributor(expenseId, contributor.id, contributor.amountPaid);
      }
    } else {
      if (contributor.amountPaid > 0) {
        await createContributor(expenseId, contributor.memberId, contributor.amountPaid);
      }
    }
  }
    
  if(reload) {
    await loadComponentData();
    loading.value = false;

    showSavedToast()
  }
};

const handleFinalizeExpense = async () => {
  loading.value = true;
  errorMessage.value = '';
  await saveExpense(false)
  const finalizedExpense = await finalizeExpense(expenseId);

  if(!finalizedExpense.success) {
    errorMessage.value = finalizedExpense.message;
    loading.value = false;
  } else {
    if (finalizedExpense.data.status === 'finalized') {
      router.push('/groups/'+groupId)
    }
    loading.value = false;
  }
}

const handleDeleteExpense = async () => {
  loading.value = true;
  const response = await deleteExpense(expenseId);
  if (response.status) {
    loading.value = false;
    toggleDeleteModal()
    router.push('/groups/'+groupId)
  }

  loading.value = false;
}

const showToast = ref(false)

function showSavedToast() {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}
</script>

<template>
    <BaseLayout>
        <!-- Back Button -->
        <div class="mb-2">
            <router-link :to="'/groups/' + groupId" class="underline">Return to group</router-link>
        </div>

        <!-- Expense Form -->
        <h2 class="text-2xl font-semibold mb-6">Edit Expense</h2>

        <!-- Expense Details -->
        <div class="space-y-4">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Expense Name</label>
                <input
                id="name"
                v-model="expense.name"
                type="text"
                class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Expense Name"
                :disabled="isFinalized"
                />
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                id="description"
                v-model="expense.description"
                class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Expense Description"
                :disabled="isFinalized"
                ></textarea>
            </div>

            <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <input
                id="category"
                v-model="expense.category"
                type="text"
                class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Category"
                :disabled="isFinalized"
                />
            </div>

            <div>
                <span class="block text-sm font-medium text-gray-700">Total Amount</span>
                {{ expense.totalAmount }}
                <span class="block text-sm font-medium text-gray-700">Status</span>
                {{ expense.status }}
            </div>
            </div>

            <!-- Participants and Contributors -->
            <div class="space-y-6 mb-8">
            <div>
                <h3 class="text-xl font-semibold mb-2">Participants</h3>
                <ul class="space-y-2">
                  <li v-for="member in members" :key="member.id" class="flex justify-between items-center">
                      <span>{{ member.user.username }}</span>
                      <input
                        v-model="participants.find(p => p.memberId === member.id).amountOwed"
                        @input="handleUpdateParticipant(member.id, participants.find(p => p.memberId === member.id).amountOwed, participants.find(p => p.memberId === member.id).id)"
                        type="number"
                        min="0"
                        placeholder="Amount Owed"
                        class="border rounded p-2"
                        :disabled="isFinalized"
                      />
                  </li>
                </ul>
            </div>

            <div>
              <h3 class="text-xl font-semibold mb-2">Contributors</h3>
              <ul class="space-y-2">
                <li v-for="member in members" :key="member.id" class="flex justify-between items-center">
                    <span>{{ member.user.username }}</span>
                    <input
                      v-model="contributors.find(c => c.memberId === member.id).amountPaid"
                      @input="handleUpdateContributor(member.id, contributors.find(c => c.memberId === member.id).amountPaid, contributors.find(c => c.memberId === member.id).id)"
                      type="number"
                      min="0"
                      placeholder="Amount Paid"
                      class="border rounded p-2"
                      :disabled="isFinalized"
                    />
                </li>
              </ul>
            </div>
        </div>

        <!-- Save / Update Buttons -->
        <div class="mt-16">
            <div v-if="errorMessage" class="text-red-500 text-center mb-4">{{ errorMessage }}</div>

            <div v-if="isFinalized" class="flex justify-center items-center">
                <router-link
                    :to="'/groups/' + groupId"
                    class="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                >
                    Return to Group Overview
                </router-link>
            </div>
            <div v-else>
                <div class="flex flex-col items-center gap-2">
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

                    <button
                        @click="saveExpense(true)"
                        class="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        Save Draft
                    </button>
                    <button
                        @click="handleFinalizeExpense"
                        class="w-full px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                    >
                        Save and Finalize Expense
                    </button>

                    <p class="text-center mt-2 text-sm text-gray-600">
                        *Once finalized, this expense cannot be modified.
                    </p>
                </div>

                <!-- Delete Button -->
                <div class="flex justify-center mt-4">
                    <button
                        @click="toggleDeleteModal"
                        class="font-semibold text-red-600 hover:text-red-700 cursor-pointer flex items-center"
                        :disabled="loading"
                    >
                        <TrashIcon class="w-4 h-4" /> Delete Expense
                    </button>
                </div>

                <router-link :to="'/groups/' + groupId" class="underline flex justify-center text-gray-600 hover:text-gray-800 mt-4">
                    Return to group
                </router-link>

                <!-- Delete Confirmation Modal -->
                <div v-if="showDeleteModal" class="fixed inset-0 flex justify-center items-center bg-black/50 z-50" @click.self="toggleDeleteModal">
                    <div class="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
                      <p v-if="!loading" class="text-lg font-semibold mb-4">Are you sure you want to delete this expense?</p>
                      <p v-else class="text-center">Deleting...</p>
                      <div class="flex justify-end gap-4">
                          <button
                              @click="toggleDeleteModal"
                              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                          >
                              Cancel
                          </button>
                          <button
                              @click.prevent="handleDeleteExpense"
                              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                          >
                              Yes, Delete
                          </button>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>
