<script setup>
// No imports needed unless you're adding a layout component
import AppFooter from '@/components/Appfooter.vue'
</script>

<template>
  <div class="bg-gray-100 min-h-screen text-gray-900">
    <router-view />
    <AppFooter />
  </div>
</template>

<style>


</style>
