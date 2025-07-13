<template>
  <div class="phone-input-demo">
    <div class="phone-input">
      <div class="form-group" style="flex-grow: 1;">
        <label class="label" for="phoneNumber">Phone Number</label>
        <input id="phoneNumber" class="input" type="tel" placeholder="123-456-7890" />
      </div>

      <div class="form-group">
        <label class="label" for="phoneType">Phone Type</label>
        <select id="phoneType" class="input select">
          <option value="">Select Type</option>
          <option value="1">Mobile</option>
          <option value="2">Home</option>
          <option value="3">Work</option>
        </select>
      </div>

      <button class="btn-outline-danger" type="button">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed — layout-only demo
</script>

<style scoped>
.phone-input-demo {
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}
.phone-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  margin: 0 auto;
}
.input {
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 4px rgba(37, 99, 235, 0.3);
}
.select {
  width: 160px;
}
.btn-outline-danger {
  border: 1px solid #dc3545;
  background-color: transparent;
  color: #dc3545;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
.label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  font-size: 0.9rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
</style>
