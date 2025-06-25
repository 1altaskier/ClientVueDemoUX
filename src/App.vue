<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">

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
  margin: 10px;
  font-family: system-ui, sans-serif;
}

.head-banner {
  background-color:silver;
  color: black;
  height: 60px;
  width: 70%;
  align-content: center;
}

.danger {
  background-color:white;
  color: red;
}
</style>
