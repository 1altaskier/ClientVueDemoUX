<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import { ref, onMounted, computed } from 'vue';

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

const query = ref('')

const clients = ref<Client[]>([]);

const filteredClients = computed(() => {
  if (!query.value.trim()) return clients.value
  const lower = query.value.toLowerCase()
  return clients.value.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(lower)
    || c.email?.toLowerCase().includes(lower)
  )
})

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
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="text-secondary">Client List</h2>
      <router-link
        to="add-client/"
        class="btn btn-outline-primary"
        title="Add Client"
      >
        <font-awesome-icon :icon="['fas', 'plus']" /> Add Client
      </router-link>
    </div>
    <div class="table-responsive">
      <SearchBar v-model:query="query" />
      <table class="table table-striped table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number(s)</th>
            <th>Email</th>
            <th class="text-center">Archived</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.clientId">
            <td>{{ client.firstName }}</td>
            <td>{{ client.lastName }}</td>
            <td>
              <ul class="list-unstyled mb-0" v-if="client.phones?.length">
                <li v-for="phone in client.phones" :key="phone.phoneId">
                  <a :href="`tel:${phone.phoneNumber}`" class="text-decoration-none text-primary">
                    {{ phone.phoneNumber }}
                  </a>
                </li>
              </ul>
              <span v-else class="text-muted fst-italic">No phone</span>
            </td>
            <td>
              <a :href="`mailto:${client.email}`" class="text-decoration-none text-primary">
                {{ client.email }}
              </a>
            </td>
            <td class="text-center">
              <font-awesome-icon
                :icon="client.isArchived ? ['fas', 'book-dead'] : ['fas', 'book-open']"
                :class="client.isArchived ? 'text-danger' : 'text-success'"
                title="Archived status"
              />
            </td>
            <td class="text-center">
              <router-link
                :to="`edit-client/${client.clientId}`"
                title="Edit Client"
                class="btn btn-sm btn-outline-secondary me-1"
              >
                <font-awesome-icon :icon="['fas', 'edit']" />
              </router-link>

              <button
                @click="confirmDelete(client.clientId)"
                title="Archive"
                class="btn btn-sm btn-outline-warning me-1"
                type="button"
              >
                <font-awesome-icon :icon="['fas', 'archive']" />
              </button>

              <button
                title="Delete"
                class="btn btn-sm btn-outline-danger"
                type="button"
                @click="confirmDelete(client.clientId)"
              >
                <font-awesome-icon :icon="['fas', 'user-times']" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
