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
    path: '/edit-client/:id',
    name: 'EditClient',
    component: EditClient,
    props: true
  },
  {
    path: '/add-client',
    name: 'AddClient',
    component: AddClient
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue') // optional fallback
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;