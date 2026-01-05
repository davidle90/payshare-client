<script setup>
import EditGroupModal from '@/components/EditGroupModal.vue';
import GroupDebtList from '@/components/GroupDebtList.vue';
import LeaveGroupModal from '@/components/LeaveGroupModal.vue';
import ManageMembersModal from '@/components/ManageMembersModal.vue';
import BaseLayout from '@/layouts/BaseLayout.vue';

import { getGroup } from '@/services/groupsApiService';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const referenceId = route.params.id;

const group = ref(null);
const members = ref([]);
const expenses = ref([]);

const groupName = ref('')
const hasUnsettled = computed(() => expenses.value.some(e => !e.isSettled))

const showActionsDropdown = ref(false)
const showMembersModal = ref(false)

const showEditGroupModal = ref(false)
const showLeaveGroupModal = ref(false)

onMounted(async () => {
  group.value = await getGroup(referenceId);
  members.value = group.value.members;
  expenses.value = group.value.expenses;

  groupName.value = group.value.name;
});

const toggleActionsDropdown = () => {
  showActionsDropdown.value = !showActionsDropdown.value
}

const toggleMembersModal = () => {
  showActionsDropdown.value = false;
  showMembersModal.value = !showMembersModal.value
}

const handleSettleUp = () => {
  showActionsDropdown.value = false;
  console.log('Settle up')
}

const showExpenseData = () => {
    showActionsDropdown.value = false;
    console.log('Show expense data')
}

const createExpense = () => {
    showActionsDropdown.value = false;
    console.log('Create expense')
}

//Update group

function editGroup() {
  showActionsDropdown.value = false;

  groupName.value = group.value.name;
  showEditGroupModal.value = true;
}

const handleGroupUpdated = (updatedGroup) => {
  groupName.value = updatedGroup.name;
  showEditGroupModal.value = false;
};

//Leave group

function leaveGroup() {
  showActionsDropdown.value = false
  showLeaveGroupModal.value = true;
}

const handleLeaveGroup = () => {
  showLeaveGroupModal.value = false;
  router.push('/dashboard');
};

//Update members
const handleUpdateMembers = (removedMemberIds) => {
  showMembersModal.value = false;
  members.value = members.value.filter(m => !removedMemberIds.includes(m.id));
};

</script>

<template>
  <BaseLayout>
    <div class="flex justify-between items-center mb-6" @click.self="showActionsDropdown = false">
      <router-link to="/dashboard" class="underline text-gray-700 hover:text-gray-900">Back</router-link>
      <div class="relative">
        <!-- Dropdown trigger -->
        <button 
          @click="toggleActionsDropdown" 
          class="px-3 py-1 rounded bg-gray-800 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-1"
        >
          Actions
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div 
          v-if="showActionsDropdown" 
          class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-10"
        >
          <button 
            @click="editGroup" 
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Edit group
          </button>
          <button 
            @click="leaveGroup" 
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Leave group
          </button>
        </div>
      </div>
    </div>

    <div v-if="group">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">{{ groupName }}</h1>
        <span class="text-sm text-gray-500">{{ group.referenceId }}</span>
      </div>

      <!-- Members -->
      <section class="mb-4">
        <div class="flex justify-between">
          <h2 class="text-lg font-semibold mb-2">Members</h2>
          <div>
            <button 
              @click="toggleMembersModal" 
              class="px-3 py-1 rounded bg-gray-800 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="member in members"
            :key="member.user.id"
            class="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
          >
            {{ member.user.username }}
          </span>
        </div>
      </section>

      <!-- Debts -->
      <section>
        <div class="mb-4">
          <h2 class="text-lg font-semibold">Debts</h2>
          <GroupDebtList :groupId="group.referenceId"/>
        </div>
      </section>

      <!-- Expenses -->
      <section>
        <div class="flex justify-between mb-4">
          <h2 class="text-lg font-semibold">Expenses</h2>
          <button @click="createExpense" class="px-3 py-1 rounded bg-gray-800 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer">
            Create expense
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="expense in expenses"
            :key="expense.id"
            @click="showExpenseData"
            class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 class="font-medium text-gray-800">{{ expense.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ expense.description }}</p>
            <p class="text-sm text-gray-700"><strong>Total: </strong>{{ expense.totalAmount }}</p>
            <p class="text-sm text-gray-700">
              <strong>Settlement: </strong>
              <span :class="expense.isSettled ? 'text-green-600' : 'text-blue-600'">
                {{ expense.isSettled ? 'Settled' : 'Pending' }}
              </span>
            </p>
            <p class="text-xs text-gray-400 mt-1">Created: {{ new Date(expense.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>
      </section>
    </div>

    <div v-else>
      <p class="text-gray-500">Loading group data...</p>
    </div>

    <div class="mt-12">
      <div class="fixed bottom-16 left-0 w-full flex justify-center px-4 z-50">
        <div 
          v-if="hasUnsettled"
          class="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 flex items-center gap-2"
        >
          <span>You have unsettled expenses</span>
          <button @click="handleSettleUp" class="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 transition cursor-pointer">
            Settle up
          </button>
        </div>

        <div 
          v-else
          class="px-4 py-2 rounded border border-gray-300 bg-white text-gray-600"
        >
          Nothing to settle
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <EditGroupModal
      :showEditGroupModal="showEditGroupModal"
      :groupName="groupName"
      :groupId="group?.referenceId || ''"
      @groupUpdated="handleGroupUpdated"
      @modalClosed="showEditGroupModal = false"
    />

    <LeaveGroupModal
      :showLeaveGroupModal="showLeaveGroupModal"
      :group
      @groupLeft="handleLeaveGroup"
      @modalClosed="showLeaveGroupModal = false"
    />

    <ManageMembersModal
      :showMembersModal
      :group
      @membersUpdated="handleUpdateMembers"
      @modalClosed="showMembersModal = false"
    />

  </BaseLayout>
</template>
