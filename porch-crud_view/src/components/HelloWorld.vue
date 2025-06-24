<template>
  <div>
    <h2>Clients</h2>
    <ul>
      <li v-for="client in clients" :key="client.id">
        {{ client.name }}
        <button @click="$emit('edit-client', client)">Edit</button>
        <button @click="removeClient(client.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getClients, deleteClient } from '../api/clientApi';

const clients = ref([]);

const loadClients = async () => {
  const response = await getClients();
  clients.value = response.data;
};

const removeClient = async (id) => {
  await deleteClient(id);
  await loadClients();
};

onMounted(loadClients);
</script>