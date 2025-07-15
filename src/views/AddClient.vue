<script setup lang="ts">
import { ref } from 'vue'
import ClientForm from '@/components/ClientForm.vue'
import type { Client } from '@/types/models'
import type { PhoneType } from '@/types/models'

const client = ref<Client>({
  clientId: 0,
  firstName: '',
  lastName: '',
  email: null,
  isArchived: false,
  phones: [],
})

const phoneTypes = ref<PhoneType[]>([])

function handleSubmit(newClient: Client) {
  console.log('Submitting new client:', newClient)
  // TODO: await axios.post('/api/clients', newClient)

  // Reset form after submission
  client.value = {
    clientId: 0,
    firstName: '',
    lastName: '',
    email: null,
    isArchived: false,
    phones: [],
  }
}
</script>

<template>
  <div class="container my-4">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-secondary">Add New Client</h2>

      <router-link to="/" class="btn btn-outline-primary" title="Back to List">
        Back to List <font-awesome-icon :icon="['fas', 'list']" />
      </router-link>
    </div>
    
    <ClientForm v-model="client" @submit="handleSubmit" />

  </div>
</template>
