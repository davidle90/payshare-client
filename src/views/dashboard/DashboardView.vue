<script setup>
import { onMounted, ref } from 'vue';
import BaseLayout from '../../layouts/BaseLayout.vue';
import { getGroups } from '../../services/groupsApiService';
import GroupList from '@/components/GroupList.vue';
import UserDebtList from '@/components/UserDebtList.vue';

const groups = ref([]);

onMounted(async () => {
  groups.value = await getGroups();
});

const createGroup = () => {
  console.log('Create group')
}

const joinGroup = () => {
  console.log('Join group')
}

</script>

<template>
  <BaseLayout>
    <div class="flex flex-col gap-4">
      <div>
        <div class="text-sm font-bold mb-2">Debts</div>
        <UserDebtList />
      </div>
      
      <div>
        <div class="flex justify-between mb-2">
          <div class="text-sm font-bold">Groups</div>
          <div class="flex gap-2">
            <button @click="joinGroup" class="px-3 py-1 cursor-pointer rounded bg-black text-sm text-white">Join group</button>
            <button @click="createGroup" class="px-3 py-1 cursor-pointer rounded bg-black text-sm text-white">Create group</button>
          </div>
        </div>
      </div>
    </div>
    <GroupList :groups />
  </BaseLayout>
</template>
