<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import PhoneInput from './PhoneInput.vue'

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

const props = defineProps<{
  modelValue: Client
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Client): void
  (e: 'submit', value: Client): void
}>()

const client = ref<Client>({ ...props.modelValue })
const showPhones = ref(false)
const phoneErrors = ref<string[]>([])

function isEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b)
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!isEqual(newVal, client.value)) {
      client.value = { ...newVal }
    }
  },
  { deep: true }
)

watch(
  client,
  (val) => {
    if (!isEqual(val, props.modelValue)) {
      emit('update:modelValue', val)
    }
  },
  { deep: true }
)

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
    phoneId: undefined,
    phoneNumber: '',
    phoneTypeId: null,
    clientId: client.value.clientId,
  })
}

function updatePhone(index: number, updatedPhone: Phone) {
  client.value.phones[index] = updatedPhone
}

function removePhone(index: number) {
  client.value.phones.splice(index, 1)
}

function onSubmit() {
  if (!validatePhones()) {
    console.warn('Phone validation failed.');
    return;
  }

  emit('submit', client.value);
}
</script>

<template>
  <form @submit.prevent="onSubmit">
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
        <label class="fw-bold">Archived:</label>
        <input type="checkbox" v-model="client.isArchived" />
      </div>
    </div>

    <h3 class="text-xl mt-6 mb-2">Phone Numbers ({{ client.phones.length }})</h3>

    <div class="mb-2">
      <button type="button" class="btn btn-primary mb-2" @click="addPhone">+ Add Phone</button>
    </div>

    <TransitionGroup name="fade" tag="div">
      <PhoneInput
        v-for="(phone, index) in client.phones"
        :key="index"
        :phone="phone"
        @update:phone="(updatedPhone) => updatePhone(index, updatedPhone)"
        @remove="removePhone(index)"
      />
    </TransitionGroup>

    <button type="submit" class="btn btn-primary mt-4">Update Client</button>
  </form>
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
</style>
