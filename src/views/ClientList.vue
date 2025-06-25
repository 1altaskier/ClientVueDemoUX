<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Client {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  isArchived: Boolean;
  phones: Phone[];
}

interface Phone {
  phoneId: number;
  clientId: number;
  phoneNumber: string;
  phoneTypeId: number;
}

/*interface PhoneType {
  phoneTypeId: number;
  phoneType: string;
}*/

// Declare `clients` with the correct type
const clients = ref<Client[]>([]);

onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7242/api/clients');

    const data = await response.json(); // read JSON once

    if (!response.ok) {
      console.error('Server error:', data);
      return;
    }

    clients.value = data;
    console.log('Loaded clients:', clients.value);
  } catch (error) {
    console.error('Unexpected error loading clients:', error);
  }
});

function confirmDelete(clientId: number) {
  const client = clients.value.find(c => c.clientId === clientId);
  if (!client) return;

  if (confirm(`Are you sure you want to delete this client (Client Id: ${client.clientId} - ${client.firstName} ${client.lastName})?`)) {
    clients.value = clients.value.filter(c => c.clientId !== clientId);
    // Optionally send a DELETE request to the backend here
  }
}

</script>

<template>
  <h2 class="text-2xl font-semibold mb-4 head-banner">Add Client
    <router-link :to="`add-client/`"><font-awesome-icon :icon="['fas', 'plus']" class="cursor-pointer" /></router-link>
  </h2>
  <div class="overflow-x-auto">
  <table class="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="px-8 py-4 text-left">First Name</th>
        <th class="px-8 py-4 text-left">Last Name</th>
        <th class="px-8 py-4 text-left">Phone Number(s)</th>
        <th class="px-8 py-4 text-left">Email</th>
        <th class="px-8 py-4 text-center">Archived</th>
        <th class="px-8 py-4 text-left">Actions</th>
      </tr>
    </thead>
    <tbody class="text-gray-800">
      <!-- Sample row -->
      <tr class="border-t border-gray-200" v-for="client in clients" :key="client.clientId">
        <td class="px-8 py-4">{{ client.firstName }}</td>
        <td class="px-8 py-4">{{ client.lastName }}</td>
        <td class="px-8 py-4">
          <ul v-if="client.phones && client.phones.length">
            <li v-for="phone in client.phones" :key="phone.phoneId">{{ phone.phoneNumber }}</li>
          </ul>
          <span v-else><li>No phone</li></span>
        </td>
        <td class="px-8 py-4">
          <a :href="`mailto:${client.email}`" class="text-blue-600 hover:underline">
            {{ client.email }}
          </a>
        </td>
        <td class="px-8 py-4 center">
          <font-awesome-icon :icon="['fas', 'book-dead']" v-if="client.isArchived" class="archived-yes" />
          <font-awesome-icon :icon="['fas', 'book-open']" v-if="!client.isArchived" class="archived-no" />
        </td>
        <td class="px-8 py-4">
          <router-link :to="`edit-client/${client.clientId}`" class="text-blue-600 hover:underline tooltiptextt">
            <font-awesome-icon :icon="['fas', 'edit']" />
            Edit
          </router-link> 
          | 
          <font-awesome-icon :icon="['fas', 'archive']" @click="confirmDelete(client.clientId)" />
          |
          <font-awesome-icon :icon="['fas', 'user-times']" class="danger" />
        </td>
      </tr>
    </tbody>
  </table>
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

.button-container {
  text-align: center;
}

.footer-button {
  height: 10;
  width: 20%;
}

.archived-yes {
  color: red;
}

.archived-no {
  color: forestgreen;
}

.center {
  text-align: center;
}

/* Tooltip container */
.tooltip-edit {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

.tooltip-archive {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

.tooltip-delete {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -60px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

</style>
