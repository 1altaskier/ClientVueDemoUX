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
  <h2 class="text-2xl font-semibold mb-4">Add Client XXX
    <router-link :to="`add-client/`"><i class="fas fa-plus cursor-pointer green-icon"></i></router-link>x
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
          <i class="fas fa-book-dead archived-yes" v-if="client.isArchived"></i>
          <i class="fas fa-book-open archived-no" v-if="!client.isArchived"></i>
        </td>
        <td class="px-8 py-4">
          <router-link :to="`edit-client/${client.clientId}`" class="text-blue-600 hover:underline">
            Edit
          </router-link> | 
          <button @click="confirmDelete(client.clientId)" class="text-red-600 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

</template>

<style scoped>
.head-banner {
  background-color:silver;
  color: black;
  height: 60px;
  align-content: center;
}

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

.archived-yes {
  color: red;
}

.archived-no {
  color: forestgreen;
}

.center {
  text-align: center;
}
</style>
