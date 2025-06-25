<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Define types
interface Phone {
  phoneNumber: string
  phoneTypeId: number | null
  clientId: number
}

interface Client {
  firstName: string
  lastName: string
  email: string
  isArchived: boolean
  phones: Phone[]
}

interface PhoneType {
  phoneTypeId: number
  type: string
}

// Typed refs
const client = ref<Client>({
  firstName: '',
  lastName: '',
  email: '',
  isArchived: false,
  phones: []
})

const phoneTypes = ref<PhoneType[]>([])

const addPhone = () => {
  client.value.phones.push({
    phoneNumber: '',
    phoneTypeId: null,
    clientId: 0 // backend will update this
  })
}

const removePhone = async (index: number) => {
  client.value.phones.splice(index, 1);

  //console.log('Submitting phone data:', JSON.stringify(client.value, null, 2));
  //await axios.delete(`https://localhost:7242/api/Phones/}`)
  //router.push('/')
}

const submitClient = async () => {
  try {
    await axios.post('https://localhost:7242/api/Clients', client.value)
    //toast.success('Client added successfully!')
    router.push('/clients') // or wherever your list view is
  } catch (err) {
    console.error(err)
    //toast.error('Failed to add client')
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('https://localhost:7242/api/PhoneTypes')
    phoneTypes.value = response.data
  } catch (err) {
    //toast.error('Failed to load phone types')
  }
})
</script>

<template>
  <div class="p-4 max-w-2xl mx-auto ">
    <h1 class="text-2xl font-semibold mb-4"><i>Add New Client</i></h1>

    <hr />
      <h3 class="text-xl mt-6 mb-2 p-2 rounded head-banner"><i>Client Information</i></h3>

    <form @submit.prevent="submitClient">
      <div class="input-padding">
        <label><b>First Name:</b></label>
        <div>
          <input v-model="client.firstName" class="input w-full" required />
        </div>
      </div>

      <div class="input-padding">
        <label><b>Last Name:</b></label>
        <div>
          <input v-model="client.lastName" class="input w-full" required />
        </div>
      </div>

      <div class="input-padding">
        <label><b>Email:</b></label>
        <div>
          <input v-model="client.email" class="input w-full" type="email" />
        </div>
      </div>

      <div class="input-padding">
        <label><b>Archived:</b></label> <input type="checkbox" v-model="client.isArchived" />
      </div>

      <hr />
      
      <h3 class="text-xl mt-6 mb-2 p-2 rounded head-banner"><i>Phone Number(s)</i> <i class="far fa-plus-square cursor-pointer green-icon" @click="addPhone"></i></h3>
      
      <div v-for="(phone, index) in client.phones" :key="index" class="input-padding">
        <label><b>Phone Number:</b></label>
      <div class="input-padding">
        <input v-model="phone.phoneNumber" class="input w-full mb-1" required />
      </div>

        <label><b>Phone Type:</b></label>
        <div class="input-padding">
          <select v-model="phone.phoneTypeId" class="input w-half">
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

        <br>
        <button type="button" class="btn-danger" @click="removePhone(index)">
          Remove Phone
        </button>
      </div>

      <hr />

      <div class="input-padding">
        <button type="submit" class="btn-primary w-full" @click="submitClient()">Save Client</button>&nbsp;<button type="reset" class="btn-primary w-full">Cancel All</button>
      </div>
      
    </form>

    <hr />

    <div class="button-container">
      <button type="reset" class="btn-primary footer-button" @click="router.push('/')"><< Back To Client List</button>
    </div>

  </div>
</template>

<style scoped>
.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  width: 40%;
}

.input-padding {
  padding: 12px;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.btn-danger {
  background-color: pink;
  color: red;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.head-banner {
  background-color:silver;
  color: black;
  height: 60px;
  align-content: center;
}

.button-container {
  text-align: center;
}

.footer-button {
  height: 10;
  width: 20%;
}

</style>