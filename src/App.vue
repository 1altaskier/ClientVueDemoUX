<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- <header class="bg-blue-600 text-white p-4 text-xl font-bold">
      My Vue App
    </header>-->

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No imports needed unless you're adding a layout component
</script>

<style>
/* Global styles if needed */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
</style>
