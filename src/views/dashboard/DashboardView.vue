<script setup>
import BaseLayout from '../../layouts/BaseLayout.vue';
import LogoutButton from '../../components/LogoutButton.vue';
</script>

<template>
  <BaseLayout>
    <div class="flex justify-center items-center">
      <h2 class="text-2xl font-bold text-center">DASHBOARD</h2>
      <LogoutButton />
    </div>
  </BaseLayout>
</template>