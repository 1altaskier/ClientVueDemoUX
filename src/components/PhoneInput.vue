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
}>()

const emit = defineEmits<{
  (e: 'update:phone', phone: Phone): void
  (e: 'remove'): void
}>()

const localPhone = ref({ ...props.phone })

watch(() => props.phone, (newVal) => {
  localPhone.value = { ...newVal }
}, { deep: true })

watch(localPhone, (val) => {
  emit('update:phone', val)
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
    <div class="phone-input-row">
      <div class="input-group">
        <label class="input-label" for="phoneNumber">Phone Number</label>
        <input
            id="phoneNumber"
            v-model="localPhone.phoneNumber"
            placeholder="(123) 456-7890"
            class="input flex-grow"
            type="tel"
            pattern="\\(\\d{3}\\) \\d{3}-\\d{4}"
            title="Format: (123) 456-7890"
            required
        />
      </div>

      <div class="input-group">
        <label class="input-label" for="phoneType">Phone Type</label>
        <select
          id="phoneType"
          v-model="localPhone.phoneTypeId"
          class="input"
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

      <button
        type="button"
        class="btn-outline-danger remove-btn"
        @click="remove"
        aria-label="Remove phone number"
        title="Remove phone number"
      >
        🗑️
      </button>
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
