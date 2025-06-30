<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Search clients..."
      v-model="searchQuery"
      @input="onInput"
    />
    <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
      ✖
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'update:query', value: string): void
}>()

const searchQuery = ref('')

function onInput() {
  emit('update:query', searchQuery.value)
}

function clearSearch() {
  searchQuery.value = ''
  emit('update:query', '')
}
</script>
