<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue'
import axios from 'axios'

interface Phone {
  phoneId?: number
  phoneTypeId: number | null
  phoneNumber: string
  clientId: number
}

interface PhoneType {
  phoneTypeId: number
  type: string
}

const phoneTypes = ref<PhoneType[]>([])

async function loadPhoneTypes() {
  try {
    const { data } = await axios.get<PhoneType[]>('https://localhost:7242/api/PhoneTypes/')
    phoneTypes.value = data
  } catch (error) {
    console.error('Error loading phone types:', error)
  }
}

const props = defineProps<{
  phone: Phone
  uniqueId: string
}>()

const emit = defineEmits<{
  (e: 'update:phone', phone: Phone): void
  (e: 'remove'): void
}>()

const localPhone = ref({ ...props.phone })

watch(() => props.phone, (newVal) => {
  localPhone.value = { ...newVal }
}, { deep: true })

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: number | undefined
  return function (...args: any[]) {
    clearTimeout(timer)
    timer = window.setTimeout(() => fn(...args), delay)
  } as T
}

const emitUpdate = debounce((val: Phone) => {
  emit('update:phone', val)
}, 100)

watch(localPhone, (val) => {
  if (JSON.stringify(val) !== JSON.stringify(props.phone)) {
    emitUpdate(val)
  }
}, { deep: true })

function remove() {
  emit('remove')
}

onMounted(async () => {
  await loadPhoneTypes()
})
</script>

<template>
<div class="phone-input-container">
  <div class="phone-input-row d-flex align-items-end gap-3 flex-wrap">

    <!-- Phone Number -->
    <div class="form-group">
      <label :for="`phoneNumber-${uniqueId}`" class="form-label">Phone Number</label>
        <input
        :id="`phoneNumber-${uniqueId}`"
        v-model="localPhone.phoneNumber"
        placeholder="Phone Number"
        class="form-control"
        type="tel"
        title="Only numbers, spaces, parentheses, plus, and dashes allowed"
        required
        />
    </div>

    <!-- Phone Type -->
    <div class="form-group">
      <label :for="`phoneType-${uniqueId}`" class="form-label">Phone Type</label>
      <select
        :id="`phoneType-${uniqueId}`"
        v-model="localPhone.phoneTypeId"
        class="form-select"
        required
      >
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

    <!-- Remove Button -->
    <div class="form-group">
      <label class="form-label invisible">Remove</label>
      <button
        type="button"
        class="btn btn-outline-danger d-block"
        @click="remove"
        aria-label="Remove phone number"
        title="Remove phone number"
      >
        🗑️
      </button>
    </div>

  </div>
</div>

</template>

<style scoped>
.phone-input-container {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

.phone-input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}

.input-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #333;
}

.input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.btn-outline-danger.remove-btn {
  align-self: center;
  border: 1px solid #dc3545;
  background-color: transparent;
  color: #dc3545;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  height: 38px;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
</style>
