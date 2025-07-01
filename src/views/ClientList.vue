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

const itemsPerPage = 10
const currentPage = ref(1)

const sortKey = ref<'firstName' | 'lastName' | 'email'>('lastName')
const sortAsc = ref(true)

const totalPages = computed(() =>
  Math.ceil(filteredClients.value.length / itemsPerPage)
)

const pagedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedClients.value.slice(start, end)
})

const sortedClients = computed(() => {
  const sorted = [...filteredClients.value]
  sorted.sort((a, b) => {
    const valA = (a[sortKey.value] || '').toString().toLowerCase()
    const valB = (b[sortKey.value] || '').toString().toLowerCase()
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
  return sorted
})

function changeSort(column: 'firstName' | 'lastName' | 'email') {
  if (sortKey.value === column) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = column
    sortAsc.value = true
  }
}

// search box input
const query = ref('')

// filter dropdown state
const archiveFilter = ref<'all' | 'archived' | 'active'>('all')

// helper to strip all non-digits from phone numbers
const clean = (s: string) => s.replace(/\D/g, '')

const clients = ref<Client[]>([]);

const filteredClients = computed(() => {
  const lowerQuery = (query.value || '').toLowerCase().trim();
  const numericQuery = clean(query.value);
  const hasQuery = lowerQuery.length > 0 || numericQuery.length > 0;

  const results = clients.value.filter(client => {
    const first = (client.firstName || '').toLowerCase();
    const last = (client.lastName || '').toLowerCase();
    const fullName = `${first} ${last}`.trim();
    const email = (client.email || '').toLowerCase();

    const phoneDigits = (client.phones ?? [])
      .filter(p => p && typeof p.phoneNumber === 'string')
      .map(p => clean(p.phoneNumber ?? ''))
      .join(' ');

    const matchesQuery =
      fullName.includes(lowerQuery) ||
      email.includes(lowerQuery) ||
      (numericQuery.length > 0 && phoneDigits.includes(numericQuery));

    const matchesArchive =
      archiveFilter.value === 'all' ||
      (archiveFilter.value === 'archived' && client.isArchived === true) ||
      (archiveFilter.value === 'active' && client.isArchived === false);

    console.log(`[MATCH TEST] "${query.value}" | numericQuery: ${numericQuery} | fullName: ${fullName} | match: ${matchesQuery} & archive: ${matchesArchive}`);

    return (hasQuery ? matchesQuery : true) && matchesArchive;
  });

  console.log('[FILTERED RESULTS]', results.length);
  return results;
});

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

      <div class="d-flex align-items-center gap-2 mb-3">
        <SearchBar v-model:query="query" />
        <select v-model="archiveFilter" class="form-select w-auto">
          <option value="all">All</option>
          <option value="active">Active Only</option>
          <option value="archived">Archived Only</option>
        </select>
      </div>

      <table class="table table-striped table-hover align-middle">
        <thead class="table-light">
          <tr>
          <th @click="changeSort('firstName')" class="sortable">
                First Name
                <span v-if="sortKey === 'firstName'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="changeSort('lastName')" class="sortable cursor-pointer">
                Last Name
                <span v-if="sortKey === 'lastName'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
                <th @click="changeSort('lastName')" class="sortable cursor-pointer">
                Phone Number
                <span v-if="sortKey === 'lastName'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
              <th @click="changeSort('email')" class="sortable">
                Email
                <span v-if="sortKey === 'email'">{{ sortAsc ? '▲' : '▼' }}</span>
              </th>
            <th class="text-center">Archived</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredClients.length === 0">
            <td colspan="6" class="text-center text-muted">No matching clients found.</td>
          </tr>
          <tr v-for="client in pagedClients" :key="client.clientId">
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

<style>
  .sortable {
    cursor: pointer;
    user-select: none;
  }
</style>
