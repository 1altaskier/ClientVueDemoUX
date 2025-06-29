<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { reactive } from 'vue'

const toast = useToast()

const route = useRoute()
const router = useRouter()

const clientId = Number(route.params.id)

const phoneErrors = ref<string[]>([]) // One error message per phone
const showPhones = ref(false) // start hidden
const phoneTypes = ref<PhoneType[]>([])

//Error Handling
const visible = ref(true)

const form = reactive({
  name: '',
  email: ''
})

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

const client = ref<Client>({
  clientId: 0,
  firstName: '',
  lastName: '',
  email: null,
  isArchived: false,
  phones: [
    {
      phoneNumber: '', 
      phoneTypeId: null,
      clientId: 0 // or whatever default ID until it's set properly
    }
  ]
})

const validatePhones = () => {
  phoneErrors.value = client.value.phones.map((phone) => {
    const pattern = /^\d{3}-\d{3}-\d{4}$/  // example: 123-456-7890

    if (!phone.phoneNumber) {
      return 'Phone number is required.'
    }

    if (!pattern.test(phone.phoneNumber)) {
      return 'Invalid phone number format. Use XXX-XXX-XXXX.'
    }

    return ''
  })

  function validateForm() {
  if (!form.name || !form.email) {
    toast.error('Please fill out all required fields.')
    return false
  }

    // Add more validation as needed
    return true
  }

  return phoneErrors.value.every(err => err === '')
}

const loadClient = async () => {
  const { data } = await axios.get<Client>(`https://localhost:7242/api/Clients/${clientId}`)
  client.value = data
}

const loadPhoneTypes = async () => {
  const { data } = await axios.get<PhoneType[]>('https://localhost:7242/api/phonetypes/')
  phoneTypes.value = data;
  console.log(phoneTypes.value);
}

const addPhone = () => {
  client.value.phones.push({
    phoneNumber: '',
    phoneTypeId: phoneTypes.value.length ? phoneTypes.value[0].phoneTypeId : 0,
    clientId: client.value.clientId
  })
}

const removePhone = async (index: number) => {
  client.value.phones.splice(index, 1);

  console.log('Submitting client data:', JSON.stringify(client.value, null, 2));
  //await axios.put(`https://localhost:7242/api/Clients/${client.value.clientId}`, client.value)
  router.push('/')
}

async function updateClient() {
  console.log('Submitting client data:', JSON.stringify(client.value, null, 2))
  toast.error('Error saving client. ❌')
  await axios.put(`https://localhost:7242/api/Clients/${client.value.clientId}`, client.value)
  toast.success('Client saved successfully! 🎉')
  router.push('/')
}

function toggleVisible() {
  visible.value = !visible.value
}

onMounted(() => {
  loadPhoneTypes()
  loadClient()
})

function showToast() {
  toast.success('🔥 Toasts are working!')
}
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4 title">
      <i>Edit Client</i></h1><button @click="showToast">Test Toast</button>
    <hr />
      <h3 class="text-xl mt-6 mb-2 p-2 rounded head-banner"><i>Client Information</i></h3>
    <hr />
    <form @submit.prevent="updateClient">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label><b>* First Name:</b></label>
          <div>
            <input v-model="client.firstName" class="input" required />

          </div>
        </div>
        <div>
          <label><b>* Last Name:</b></label>
          <div>
            <input v-model="client.lastName" class="input" required />
          </div>
        </div>
        <div>
          <label><b>* Email:</b></label>
          <div>
            <input v-model="client.email" type="email" class="input" />
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <label><b>Archived:</b></label> <input type="checkbox" v-model="client.isArchived" />
        </div>
      </div>

      <hr />
    <h3 class="text-xl mt-6 mb-2 head-banner"><i>Phone Numbers ({{client.phones.length}})</i>
      </hr>
      &nbsp;
      <template>
        <template>
  <div class="cursor-pointer text-2xl" @click="showPhones = !showPhones">
    <font-awesome-icon
      :icon="showPhones ? ['fas', 'minus'] : ['fas', 'plus']"
      class="cursor-pointer"
    />
  </div>
</template>
    <div class="cursor-pointer text-2xl" @click="showPhones = !showPhones">
      <font-awesome-icon
        :icon="showPhones ? ['fas', 'minus'] : ['fas', 'plus']"
        class="cursor-pointer"
      />
    </div>
      </template>
      <font-awesome-icon :icon="['fas', 'minus']" class="cursor-pointer" 
        v-if="showPhones" />
      <font-awesome-icon :icon="['fas', 'plus']" class="cursor-pointer" 
        v-else
        @click="showPhones = true" />
        <i
          class="far fa-minus-square cursor-pointer"
          v-if="showPhones"
          @click="showPhones = false">
        </i>
        <i
          class="far fa-plus-square cursor-pointer"
          v-else
          @click="showPhones = true">
        </i>
      </h3>
      <hr />
      <div 
        v-if="showPhones"
         v-for="(phone, index) in client.phones" 
         :key="index" 
         class="border p-3 rounded mb-2"
      >
        <label><b>* Number:</b></label>
        <div>
          <input v-model="phone.phoneNumber" class="input w-full mb-2" placeholder="Phone Number" />
        </div>

        <label><b>* Phone Type:</b></label>
        <div>
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
        </div>

        <div>
          <button type="button" @click="removePhone(index)" class="btn-primary">
            Remove 🗑️
          </button>
        </div>

        <hr />
      </div>

      <button type="button" @click="addPhone" class="btn-primary">+ Add Phone</button>

      <div class="mt-6">
        <button type="submit" class="btn-primary" @click="updateClient()">Update Client</button> <button type="reset" class="btn-primary" >Reset All</button>
      </div>

    <hr />

    <div class="button-container">
      <button type="reset" class="btn-primary footer-button" @click="router.push('/')"><< Back To Client List</button>
    </div>
    </form>
  </div>
</template>

<style scoped>
.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  width: 40%;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.button-container {
  text-align: center;
}

.footer-button {
  height: 10;
  width: 20%;
}
</style>
