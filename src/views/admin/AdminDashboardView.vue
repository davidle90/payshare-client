<script setup>
import { onMounted, ref } from 'vue';
import BaseLayout from '../../layouts/BaseLayout.vue';
import { getGroups } from '../../services/groupsApiService';
import GroupList from '@/components/GroupList.vue';
import UserDebtList from '@/components/UserDebtList.vue';
import JoinGroupButton from '@/components/JoinGroupButton.vue';
import CreateGroupButton from '@/components/CreateGroupButton.vue';

const groups = ref([]);

onMounted(async () => {
  groups.value = await getGroups();
});

const handleGroupCreated = (group) => {
  groups.value.unshift(group)
}

const handleGroupJoined = async () => {
  try {
    groups.value = await getGroups();
  } catch (error) {
    console.error('Error fetching groups after joining:', error);
  }
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
            <JoinGroupButton  @groupJoined="handleGroupJoined" />
            <CreateGroupButton  @groupCreated="handleGroupCreated" />
          </div>
        </div>
      </div>
    </div>
    <GroupList :groups />
  </BaseLayout>
</template>
