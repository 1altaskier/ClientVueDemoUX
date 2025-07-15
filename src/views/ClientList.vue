<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios'
import { useToast } from 'vue-toastification'
import type { Phone } from '@/types';

// --- Interfaces ---
interface Client {
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  isArchived: Boolean;
  phones: { phoneNumber: string }[]
}

// --- Reactive State ---
const clients = ref<Client[]>([]);
const query = ref('');
const archiveFilter = ref<'all' | 'archived' | 'active'>('all');

const sortKey = ref<'firstName' | 'lastName' | 'email' | 'phone'>('lastName');
const sortDirection = ref<'asc' | 'desc'>('asc');
const sortAsc = ref(true); // (Unused? consider removing)

const itemsPerPage = ref(5);
const currentPage = ref(1);

const showArchiveModal = ref(false);
const clientToArchive = ref<Client | null>(null);

const showDeleteModal = ref(false);
const clientToDelete = ref<Client | null>(null);

const toast = useToast();

// --- Lifecycle Hooks ---
onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7242/api/clients');
    const data = await response.json();

    if (!response.ok) {
      console.error('Server error:', data);
      return;
    }

    clients.value = data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
});

// --- Modal Handlers ---
function requestDelete(client: Client) {
  clientToDelete.value = client;
  showDeleteModal.value = true;
}

function requestArchive(client: Client) {
  clientToArchive.value = client;
  showArchiveModal.value = true;
}

// --- Archive & Delete API calls ---
async function confirmArchive() {
  if (!clientToArchive.value) return;

  const dto = {
    clientId: clientToArchive.value.clientId,
    firstName: clientToArchive.value.firstName,
    lastName: clientToArchive.value.lastName,
    email: clientToArchive.value.email || '',
    isArchived: true,
    phones: (clientToArchive.value.phones as Phone[]).map(phone => ({
      phoneId: phone.phoneId ?? 0,
      clientId: phone.clientId,
      phoneTypeId: phone.phoneTypeId,
      phoneNumber: phone.phoneNumber
    }))
  };

  try {
    await axios.put(`https://localhost:7242/api/clients/${dto.clientId}`, dto);

    clients.value = clients.value.filter(c => c.clientId !== dto.clientId);
    toast.success(`Client ${dto.firstName} ${dto.lastName} archived.`);
  } catch (err) {
    console.error(err);
    toast.error('Failed to archive client.');
  } finally {
    showArchiveModal.value = false;
    clientToArchive.value = null;
  }
}

async function confirmDelete() {
  if (!clientToDelete.value) return;

  const id = clientToDelete.value.clientId;
  try {
    await axios.delete(`https://localhost:7242/api/clients/${id}`);

    clients.value = clients.value.filter(c => c.clientId !== id);
    toast.success(`Client ${clientToDelete.value.firstName} ${clientToDelete.value.lastName} deleted.`);
  } catch (err) {
    console.error(err);
    toast.error('Failed to delete client.');
  } finally {
    showDeleteModal.value = false;
    clientToDelete.value = null;
  }
}

// --- Filtering & Searching ---
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

// --- Sorting ---
const sortedClients = computed(() => {
  const key = sortKey.value;
  const dir = sortDirection.value === 'asc' ? 1 : -1;

  return [...filteredClients.value].sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (key === 'phone') {
      aVal = a.phones[0]?.phoneNumber || '';
      bVal = b.phones[0]?.phoneNumber || '';
    } else {
      aVal = (a as any)[key] ?? '';
      bVal = (b as any)[key] ?? '';
    }

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });
});

function setSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
}

// --- Pagination ---
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

// --- Watchers ---
watch([query, archiveFilter, sortKey, sortDirection, itemsPerPage], () => {
  currentPage.value = 1;
});
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
              Phone Number(s)
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
                title="Archive"
                class="btn btn-sm btn-outline-warning me-1"
                type="button"
                :disabled="client.isArchived === true"
                @click="requestArchive(client)"
              >
                <font-awesome-icon
                  :icon="['fas', 'archive']"
                  :class="{ 'text-muted': client.isArchived === true, 'text-warning': !client.isArchived }"
                />
              </button>

              <button
                title="Delete"
                class="btn btn-sm btn-outline-danger"
                type="button"
                @click="requestDelete(client)"
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

  <div
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block"
    v-if="showArchiveModal"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-warning">Confirm Archive</h5>
          <button type="button" class="btn-close" @click="showArchiveModal = false"></button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to Archive
            <strong>{{ clientToArchive?.firstName }} {{ clientToArchive?.lastName }}</strong>?
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showArchiveModal = false">Cancel</button>
          <button class="btn btn-warning" @click="confirmArchive">
            <i class="fas fa-trash me-1"></i> Archive
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Optional overlay -->
<div class="modal-backdrop fade show" v-if="showArchiveModal"></div>

  <div
  class="modal fade show"
  tabindex="-1"
  role="dialog"
  style="display: block"
  v-if="showDeleteModal"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-danger">Confirm Delete</h5>
        <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
      </div>
      <div class="modal-body">
        <p>
          Are you sure you want to DELETE
          <strong>{{ clientToDelete?.firstName }} {{ clientToDelete?.lastName }}</strong>?
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
        <button class="btn btn-danger" @click="confirmDelete">
          <i class="fas fa-trash me-1"></i> Delete
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Optional overlay -->
<div class="modal-backdrop fade show" v-if="showDeleteModal"></div>

</template>

<style>
  .sortable {
    cursor: pointer;
    user-select: none;
  }
</style>
