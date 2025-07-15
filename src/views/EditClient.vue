<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import ClientForm from '@/components/ClientForm.vue'
import AppFooter from '@/components/AppFooter.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Client } from '@/types/models'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const clientId = Number(route.params.id)

const client = ref<Client>({
  clientId: 0,
  firstName: '',
  lastName: '',
  email: null,
  isArchived: false,
  phones: []
})

const isEdit = computed(() => !!route.params.id)

async function updateClient() {
  try {
    await axios.put(`https://localhost:7242/api/Clients/${client.value.clientId}`, client.value)
    toast.success('Client updated successfully!')
    router.push('/')
  } catch {
    toast.error('Failed to update client.')
  }
}

async function loadClient() {
  const { data } = await axios.get<Client>(`https://localhost:7242/api/Clients/${clientId}`)
  client.value = data
}

onMounted(async () => {
  if (isEdit.value) await loadClient()
})
</script>

<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-secondary">Edit Client</h2>
      <router-link to="/" class="btn btn-outline-primary" title="Back to List">
        Back to List <font-awesome-icon :icon="['fas', 'list']" />
      </router-link>
    </div>
    <div class="p-4 max-w-2xl mx-auto">
      <ClientForm
        v-model="client"
        @submit="updateClient"
      />
    </div>
  </div>
</template>
