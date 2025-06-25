import { createRouter, createWebHistory } from 'vue-router';
import ClientList from '../views/ClientList.vue';
import EditClient from '@/components/EditClient.vue';
import AddClient from '@/components/AddClient.vue';
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
    path: '/',
    name: 'ClientList',
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;