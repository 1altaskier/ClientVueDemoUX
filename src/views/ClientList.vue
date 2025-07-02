<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import { ref, onMounted, computed, watch } from 'vue';

onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7242/api/clients');
    const data = await response.json(); // parse response body once

    if (!response.ok) {
      console.error('Server error:', data);
      return;
    }

    clients.value = data; // assign to your local ref
  } catch (error) {
    console.error('Fetch error:', error);
  }
});

interface Client {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  isArchived: Boolean;
  phones: { phoneNumber: string }[]
}

const sortAsc = ref(true)


// search box input
const query = ref('')

// filter dropdown state
const archiveFilter = ref<'all' | 'archived' | 'active'>('all')

const clients = ref<Client[]>([]);

const filteredClients = computed(() => {
  return clients.value.filter(client => {
    const search = query.value.toLowerCase();
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const email = client.email?.toLowerCase() || '';
    const phoneNumbers = client.phones.map(p => p.phoneNumber).join(' ');
    const archiveMatch =
      archiveFilter.value === 'all' ||
      (archiveFilter.value === 'active' && !client.isArchived) ||
      (archiveFilter.value === 'archived' && client.isArchived);

    const match = fullName.includes(search)
      || email.includes(search)
      || phoneNumbers.includes(search);

    return archiveMatch && match;
  });
});

type SortField = 'firstName' | 'lastName' | 'email' | 'phone';

const sortKey = ref<SortField>('lastName');
const sortDirection = ref<'asc' | 'desc'>('asc');

const sortedClients = computed(() => {
  const key = sortKey.value;
  const dir = sortDirection.value === 'asc' ? 1 : -1;

  return [...filteredClients.value].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (key === 'phone') {
      // Sort by first phone number, or empty string if none
      aVal = a.phones[0]?.phoneNumber || '';
      bVal = b.phones[0]?.phoneNumber || '';
    } else {
      aVal = (a as any)[key] ?? '';
      bVal = (b as any)[key] ?? '';
    }

    // Normalize strings to lowercase for consistent sorting
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });
});

function setSort(key: SortField) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
}

const itemsPerPage = ref(5);
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil(sortedClients.value.length / itemsPerPage.value);
});

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

const pagedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedClients.value.slice(start, start + itemsPerPage.value);
});

watch([query, archiveFilter, sortKey, sortDirection, itemsPerPage], () => {
  currentPage.value = 1;
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
            <th @click="setSort('firstName')" class="sortable cursor-pointer">
              First Name
              <font-awesome-icon
                v-if="sortKey === 'firstName' && sortAsc"
                :icon="['fas', 'arrow-up']"
                class="ms-1"
              />
              <font-awesome-icon
                v-else-if="sortKey === 'firstName' && !sortAsc"
                :icon="['fas', 'arrow-down']"
                class="ms-1"
              />
            </th>

            <th @click="setSort('lastName')" class="sortable cursor-pointer">
              Last Name
              <font-awesome-icon
                v-if="sortKey === 'lastName' && sortAsc"
                :icon="['fas', 'arrow-up']"
                class="ms-1"
              />
              <font-awesome-icon
                v-else-if="sortKey === 'lastName' && !sortAsc"
                :icon="['fas', 'arrow-down']"
                class="ms-1"
              />
            </th>

            <th @click="setSort('phone')" class="sortable cursor-pointer">
              Phone Number
              <font-awesome-icon
                v-if="sortKey === 'phone' && sortAsc"
                :icon="['fas', 'arrow-up']"
                class="ms-1"
              />
              <font-awesome-icon
                v-else-if="sortKey === 'phone' && !sortAsc"
                :icon="['fas', 'arrow-down']"
                class="ms-1"
              />
            </th>


            <th @click="setSort('email')" class="sortable cursor-pointer">
              Email
              <font-awesome-icon
                v-if="sortKey === 'email' && sortAsc"
                :icon="['fas', 'arrow-up']"
                class="ms-1"
              />
              <font-awesome-icon
                v-else-if="sortKey === 'email' && !sortAsc"
                :icon="['fas', 'arrow-down']"
                class="ms-1"
              />
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
                <li v-for="phone in client.phones" :key="phone.phoneNumber">
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
          <tr>
            <td>
              <div class="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-2">

                <!-- Items Per Page Selector -->
                <div>
                  <label for="itemsPerPage" class="form-label me-2">Show:</label>
                  <select
                    id="itemsPerPage"
                    v-model.number="itemsPerPage"
                    class="form-select d-inline-block w-auto"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                  <span class="ms-2">per page</span>
                </div>

                <!-- Pagination Controls -->
                <nav>
                  <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                        ‹ Prev
                      </button>
                    </li>

                    <li
                      v-for="page in pageNumbers"
                      :key="page"
                      class="page-item"
                      :class="{ active: page === currentPage }"
                    >
                      <button class="page-link" @click="currentPage = page">{{ page }}</button>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
                        Next ›
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

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
