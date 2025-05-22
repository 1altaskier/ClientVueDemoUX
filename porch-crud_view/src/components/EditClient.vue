<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

interface Phone {
  phoneId?: number
  clientId?: number
  phoneNumber: string
  phoneTypeId: number
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
const clientId = Number(route.params.id)

const client = ref<Client>({
  clientId: 0,
  firstName: '',
  lastName: '',
  email: null,
  isArchived: false,
  phones: []
})

const phoneTypes = ref<PhoneType[]>([])

const loadClient = async () => {
  const { data } = await axios.get<Client>(`https://localhost:7242/api/Clients/${clientId}`)
  client.value = data
}

const loadPhoneTypes = async () => {
  const { data } = await axios.get<PhoneType[]>('https://localhost:7242/api/phonetypes/')
  phoneTypes.value = data
  console.log(phoneTypes.value);
}

const addPhone = () => {
  client.value.phones.push({
    phoneNumber: '',
    phoneTypeId: phoneTypes.value.length ? phoneTypes.value[0].phoneTypeId : 0
  })
}

const removePhone = (index: number) => {
  client.value.phones.splice(index, 1)
}

const saveClient = async () => {
  await axios.put(`https://localhost:7242/api/Clients/${clientId}`, client.value)
  router.push('/')
}

onMounted(() => {
  loadPhoneTypes()
  loadClient()
})
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Edit Client</h1>

      <hr />
        <h3 class="text-xl mt-6 mb-2 bg-gray-100 p-2 rounded">Client Information</h3>
      <hr />
    <form @submit.prevent="saveClient">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label><b>* First Name:</b></label>
          <input v-model="client.firstName" class="input" required />
        </div>
        <div>
          <label><b>* Last Name:</b></label>
          <input v-model="client.lastName" class="input" required />
        </div>
        <div>
          <label><b>* Email:</b></label>
          <input v-model="client.email" type="email" class="input" />
        </div>
        <div class="flex items-center gap-2 mt-2">
          <label><b>Archived:</b></label>
          <input type="checkbox" v-model="client.isArchived" />
        </div>
      </div>

      <hr />
      <h3 class="text-xl mt-6 mb-2">Phone Numbers</h3>
      <hr />
      <div v-for="(phone, index) in client.phones" :key="index" class="border p-3 rounded mb-2">
        <label><b>Number:</b></label>
        <input v-model="phone.phoneNumber" class="input w-full mb-2" placeholder="Phone Number" />

        <label><b>Phone Type:</b></label>
        <select v-model="phone.phoneTypeId" class="input w-full">
          <option disabled value="">Select Phone Type</option>
          <option
            v-for="type in phoneTypes"
            :key="type.phoneTypeId"
            :value="type.phoneTypeId"
          >
            {{ type.type }}
          </option>
        </select>

        <button type="button" @click="removePhone(index)" class="text-red-600 mt-2">
          Remove Phone
        </button>

        <hr />

        <div class="height">
dsd
        </div>
      </div>

      <button type="button" @click="addPhone" class="mt-2 text-blue-600">+ Add Phone</button>

      <div class="mt-6">
        <button type="submit" class="btn-primary">Update Client</button>
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
</style>
