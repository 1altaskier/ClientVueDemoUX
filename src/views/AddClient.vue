<script setup lang="ts">
  import ClientForm from '@/components/ClientForm.vue'
  import { reactive } from 'vue';

  const client = reactive({ name: '' }) // or fetch existing one for edit

  function handleSubmit(updatedClient: any) {
  // Save to API or update state
  console.log('Submitted:', updatedClient)
}
</script>

<template>
  <ClientForm :client="client" @submit="handleSubmit" />
</template>