<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import AppFooter from '@/components/AppFooter.vue'

interface Phone {
  phoneId?: number
  phoneTypeId: number | null
  phoneNumber: string
  clientId: number
}

interface Client {
  clientId: number
  firstName: string
  lastName: string
  email: string | null
  isArchived: boolean | null
  phones: Phone[]
}

interface PhoneType {
  phoneTypeId: number
  type: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const clientId = Number(route.params.id)
const showPhones = ref(false)
const phoneTypes = ref<PhoneType[]>([])
const phoneErrors = ref<string[]>([])

const client = ref<Client>({
  clientId: 0,
  firstName: '',
  lastName: '',
  email: null,
  isArchived: false,
  phones: []
})

let originalClient: Client | null = null

const isEdit = computed(() => !!route.params.id)

function validatePhones() {
  phoneErrors.value = client.value.phones.map(phone => {
    const pattern = /^\d{3}-\d{3}-\d{4}$/
    if (!phone.phoneNumber) return 'Phone number is required.'
    if (!pattern.test(phone.phoneNumber)) return 'Invalid format. Use XXX-XXX-XXXX.'
    return ''
  })
  return phoneErrors.value.every(err => err === '')
}

function addPhone() {
  client.value.phones.push({
    phoneNumber: '',
    phoneTypeId: phoneTypes.value.length ? phoneTypes.value[0].phoneTypeId : null,
    clientId: client.value.clientId
  })
}

function removePhone(index: number) {
  client.value.phones.splice(index, 1)
}

function resetChanges() {
  if (originalClient) {
    client.value = JSON.parse(JSON.stringify(originalClient))
    toast.info('Changes reset.')
  }
}

async function updateClient() {
  if (!client.value.firstName || !client.value.lastName || !client.value.email) {
    toast.error('Please fill in all required fields.')
    return
  }
  if (!validatePhones()) {
    toast.error('Please correct phone number errors.')
    return
  }
  try {
    await axios.put(`https://localhost:7242/api/Clients/${client.value.clientId}`, client.value)
    toast.success('Client updated successfully!')
    router.push('/')
  } catch {
    toast.error('Failed to update client.')
  }
}

function toastifyFormError() {
  toast.success('Please correct the identified fields.')
}

async function loadClient() {
  const { data } = await axios.get<Client>(`https://localhost:7242/api/Clients/${clientId}`)
  client.value = data
  originalClient = JSON.parse(JSON.stringify(data))
}

async function loadPhoneTypes() {
  const { data } = await axios.get<PhoneType[]>('https://localhost:7242/api/phonetypes/')
  phoneTypes.value = data
}

onMounted(async () => {
  await loadPhoneTypes()
  if (isEdit.value) await loadClient()
})
</script>

<template>
  <div class="container my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-secondary">Edit Client</h2>
      <router-link
        to="/"
        class="btn btn-outline-primary"
        title="Add Client"
      >
        <font-awesome-icon :icon="['fas', 'list']" /> Back to List
      </router-link>
    </div>
    <div class="p-4 max-w-2xl mx-auto">
      <form @submit.prevent="updateClient">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="m-2 p-2">
            <label class="fw-bold">* First Name:</label>
            <input v-model="client.firstName" class="input" required />
          </div>
          <div class="m-2 p-2">
            <label class="fw-bold">* Last Name:</label>
            <input v-model="client.lastName" class="input" required />
          </div>
          <div class="m-2 p-2">
            <label class="fw-bold">* Email:</label>
            <input v-model="client.email" type="email" class="input" required />
          </div>
          <div class="flex items-center gap-2 mt-2">
            <label class="fw-bold">Archived:</label> <input type="checkbox" v-model="client.isArchived" />
          </div>
        </div>

        <h3 class="text-xl mt-6 mb-2">Phone Numbers ({{ client.phones.length }})</h3>
        <button type="button" class="btn-primary-show-phone mb-2" @click="showPhones = !showPhones">
          
          {{showPhones ? 'Hide Phones' : 'Show Phones'}}
            
        </button>
        <div v-if="showPhones">
          <div v-for="(phone, index) in client.phones" :key="index" class="border p-3 rounded mb-2">
            <label class="fw-bold">Number:</label>
            <input v-model="phone.phoneNumber" class="input w-full mb-2" placeholder="123-456-7890" />
            <label class="fw-bold">Phone Type:</label>
            <select v-model="phone.phoneTypeId" class="input w-full">
              <option disabled value="">Select Phone Type</option>
              <option v-for="type in phoneTypes" :key="type.phoneTypeId" :value="type.phoneTypeId">
                {{ type.type }}
              </option>
            </select>
            <button type="button" class="btn btn-outline-danger mt-2" @click="removePhone(index)">Remove</button>
          </div>
          <button type="button" class="btn btn-primary" @click="addPhone">+ Add New Phone</button>
        </div>
      </form>
      <app-footer />
    </div>
  </div>
</template>

<style scoped>
  .input {
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 8px;
    width: 100%;
  }

  .btn-primary-show-phone {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }

  .btn-primary {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    width: 30%;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }

  .btn-light {
    background-color: #f3f4f6;
    color: #111827;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }

  .input-error {
    background-color: red;
    color: #111827;
  }
</style>
