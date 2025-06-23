<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Client List</h1>

    <div v-if="loading" class="text-gray-500">Loading clients...</div>
    <div v-else-if="clients.length === 0" class="text-gray-500">No clients found.</div>
    <ul v-else class="space-y-2">
      <li v-for="client in clients" :key="client.id" class="p-4 border rounded shadow-sm">
        <p><strong>Name:</strong> {{ client.name }}</p>
        <p><strong>Email:</strong> {{ client.email }}</p>
        <p><strong>Phones:</strong></p>
        <ul class="ml-4 list-disc">
          <li v-for="phone in client.phones" :key="phone.id">
            {{ phone.number }} ({{ phone.phoneType?.name || 'Unknown type' }})
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getClients } from '@/api' // adjust the path if needed

const clients = ref([])
const loading = ref(true)

const loadClients = async () => {
  try {
    const response = await getClients()
    clients.value = response.data
  } catch (error) {
    console.error('Failed to load clients:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadClients)
</script>
