<template>
  <div id="app">
    <router-view />
    <AppFooter />
  </div>
</template>

//<script setup>
// No imports needed unless you're adding a layout component
//import AppFooter from '@/components/AppFooter.vue'
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
  width: 100%;
  align-content: center;
}

.danger {
  background-color:white;
  color: red;
}

.stealie-icon {
  width: 40px;
  height: 40px;
}
</style>
