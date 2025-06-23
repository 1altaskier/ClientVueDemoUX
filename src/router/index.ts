import { createRouter, createWebHistory } from 'vue-router';
import ClientList from '../views/ClientList.vue';
import EditClient from '@/components/EditClient.vue';
import AddClient from '@/components/AddClient.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ClientList
  },
  {
    path: '/edit-client/:id',        // 👈 dynamic segment for ID
    name: 'EditClient',
    component: EditClient,
    props: true                      // 👈 optional: passes `id` as a prop
  },
    {
    path: '/add-client/',        // 👈 dynamic segment for ID; 0 = new Client
    name: 'AddClient',
    component: AddClient,
    props: true                      // 👈 optional: passes `id` as a prop
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
