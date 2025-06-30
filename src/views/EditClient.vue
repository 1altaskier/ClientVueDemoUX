<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

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
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Edit Client</h1>

    <form @submit.prevent="updateClient">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="m-2 p-2">
          <label>* First Name:</label>
          <input v-model="client.firstName" class="input" required />
        </div>
        <div class="m-2 p-2">
          <label>* Last Name:</label>
          <input v-model="client.lastName" class="input" required />
        </div>
        <div class="m-2 p-2">
          <label>* Email:</label>
          <input v-model="client.email" type="email" class="input" required />
        </div>
        <div class="flex items-center gap-2 mt-2">
          <label>Archived:</label>
          <input type="checkbox" v-model="client.isArchived" />
        </div>
      </div>

      <h3 class="text-xl mt-6 mb-2">Phone Numbers ({{ client.phones.length }})</h3>
      <button type="button" class="btn-primary mb-2" @click="showPhones = !showPhones">
        {{ showPhones ? 'Hide Phones' : 'Show Phones' }}
      </button>

      <div v-if="showPhones">
        <div v-for="(phone, index) in client.phones" :key="index" class="border p-3 rounded mb-2">
          <label>Number:</label>
          <input v-model="phone.phoneNumber" class="input w-full mb-2" placeholder="123-456-7890" />
          <label>Phone Type:</label>
          <select v-model="phone.phoneTypeId" class="input w-full">
            <option disabled value="">Select Phone Type</option>
            <option v-for="type in phoneTypes" :key="type.phoneTypeId" :value="type.phoneTypeId">
              {{ type.type }}
            </option>
          </select>
          <button type="button" class="btn-primary mt-2" @click="removePhone(index)">Remove</button>
        </div>
        <button type="button" class="btn-primary" @click="addPhone">+ Add Phone</button>
      </div>
      <div class="mt-6 w-full">
        <!-- Row 1: Update + Reset -->
        <div class="flex gap-2 mb-2">
          <button type="submit" class="btn-primary" @click="toastifyFormError()">Update Client</button>
          <button type="button" class="btn-secondary" @click="resetChanges">Reset Changes</button>
        </div>

        <!-- Row 2: Back to List -->
        <div>
          <button type="button" class="btn-light w-full sm:w-auto" @click="router.push('/')">Back to List</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .input {
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 8px;
    width: 100%;
  }

  .btn-primary {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
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
