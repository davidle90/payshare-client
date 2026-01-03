<script setup>
</script>

<template>
  <div class="h-screen flex flex-col justify-between">
    <!-- Header -->
    <header class="bg-white shadow p-4 text-center font-bold text-xl">
      <slot name="header"><router-link to="/">PAYSHARE</router-link></slot>
    </header>

    <!-- Main -->
    <main class="grow flex flex-col justify-center">
      <div class="container mx-auto py-6">
        <slot></slot>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white shadow p-4 text-center text-sm text-gray-500">
      <slot name="footer">© 2025 PAYSHARE</slot>
    </footer>
  </div>
</template>
