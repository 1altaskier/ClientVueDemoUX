<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      :value="query"
      @input="onInput"
      placeholder="Search clients..."
    />
    <button class="btn btn-outline-secondary" type="button" @click="clearSearch">
      ✖
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ query: string }>()
  const emit = defineEmits<{ (e: 'update:query', value: string): void }>()

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:query', target.value)
  }

  function clearSearch() {
    emit('update:query', '')
  }
</script>
