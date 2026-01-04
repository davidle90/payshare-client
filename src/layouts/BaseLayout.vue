<script setup>
  import Header from './Header.vue';
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow p-4 text-center font-semibold text-xl">
      <!-- If no header slot is provided, display the Header component by default -->
      <slot name="header"><Header /></slot>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col justify-start">
      <div class="container mx-auto py-6 px-4">
        <slot></slot>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white shadow p-4 text-center text-sm text-gray-500">
      <!-- If no footer slot is provided, display the default footer text -->
      <slot name="footer">© 2026 PAYSHARE</slot>
    </footer>
  </div>
</template>

