<script setup lang="ts">
import { ref, defineEmits, defineProps, computed } from 'vue'
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

const phoneErrors = ref<string[]>([])

function isEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

// ✅ Computed for two-way binding without watchers
const client = computed({
  get() {
    return props.modelValue
  },
  set(val: Client) {
    if (!isEqual(val, props.modelValue)) {
      emit('update:modelValue', val)
    }
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Client): void
  (e: 'submit', value: Client): void
}>()

function validatePhones() {
  phoneErrors.value = client.value.phones.map(phone => {
    const digits = stripNonDigits(phone.phoneNumber)
    if (!phone.phoneNumber) return 'Phone number is required.'
    if (digits.length !== 10) return 'Phone number must have exactly 10 digits.'
    return ''
  })
  return phoneErrors.value.every(err => err === '')
}

function stripNonDigits(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '')
}

function addPhone() {
  client.value = {
    ...client.value,
    phones: [
      ...client.value.phones,
      {
        phoneId: undefined,
        phoneNumber: '',
        phoneTypeId: null,
        clientId: client.value.clientId,
      }
    ]
  }
}

function updatePhone(index: number, updatedPhone: Phone) {
  client.value.phones = client.value.phones.map((p, i) =>
    i === index ? updatedPhone : p
  )
}

function removePhone(index: number) {
  client.value.phones.splice(index, 1)
}

function onSubmit() {
  if (!validatePhones()) {
    console.warn('Phone validation failed.')
    return
  }

  // Normalize phone numbers before submission
  client.value.phones = client.value.phones.map(p => ({
    ...p,
    phoneNumber: stripNonDigits(p.phoneNumber)
  }))

  emit('submit', client.value)
}
</script>


<template>
  <hr />
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
        <label class="fw-bold">Archived:</label> <input type="checkbox" v-model="client.isArchived" />
      </div>
    </div>

    <hr />

    <div>
      <h3 class="text-xl mt-6 mb-2">Phone Numbers ({{ client.phones.length }})</h3>
    </div>
    <div class="mb-2">
      <button type="button" class="btn btn-outline-primary" title="Back to List" @click="addPhone">Add New Phone <font-awesome-icon :icon="['fas', 'plus-circle']" /></button>
    </div>    



    <TransitionGroup name="fade" tag="div">
      <PhoneInput
        v-for="(phone, index) in client.phones"
        :key="phone.phoneId ?? `new-${index}`"
        :phone="phone"
        :uniqueId="`phone-${index}`"
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
