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
  <div>
    <div class="">
      <h2 class="">Client List</h2>
      <router-link :to="`add-client/`" title="Add Client">
        <font-awesome-icon :icon="['fas', 'plus']" class="" />
      </router-link>
    </div>

    <div class="">
      <table class="">
        <thead class="">
          <tr>
            <th class="">First Name</th>
            <th class="">Last Name</th>
            <th class="">Phone Number(s)</th>
            <th class="">Email</th>
            <th class=" text-center">Archived</th>
            <th class=" text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="client in clients" :key="client.clientId" class="hover:bg-gray-50">
            <td class="">{{ client.firstName }}</td>
            <td class="">{{ client.lastName }}</td>
            <td class="">
              <ul v-if="client.phones?.length">
                <li v-for="phone in client.phones" :key="phone.phoneId">
                  <a :href="`tel:${phone.phoneNumber}`" class="">
                    {{ phone.phoneNumber }}
                  </a>
                </li>
              </ul>
              <span v-else class="">No phone</span>
            </td>
            <td class="">
              <a :href="`mailto:${client.email}`" class="">
                {{ client.email }}
              </a>
            </td>
            <td class="">
              <font-awesome-icon :icon="client.isArchived ? ['fas', 'book-dead'] : ['fas', 'book-open']"
                :class="client.isArchived ? 'text-red-600' : 'text-green-600'" />
            </td>
            <td class="">
              <router-link :to="`edit-client/${client.clientId}`" title="Edit Client">
                <font-awesome-icon :icon="['fas', 'edit']" class="" />
              </router-link>
              <button @click="confirmDelete(client.clientId)" title="Archive" class="focus:outline-none">
                <font-awesome-icon :icon="['fas', 'archive']" class="" />
              </button>
              <button title="Delete" class="focus:outline-none">
                <font-awesome-icon :icon="['fas', 'user-times']" class="" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>

</style>
