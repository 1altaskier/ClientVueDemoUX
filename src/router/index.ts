import { createRouter, createWebHistory } from 'vue-router';
import ClientList from '../views/ClientList.vue';
import EditClient from '../views/EditClient.vue';
import AddClient from '../views/AddClient.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ClientList
  },
  {
    path: '/components/EditClient/:id',
    name: 'EditClient',
    component: EditClient,
    props: true
  },
    {
    path: '/add-client/', 
    name: 'AddClient',
    component: AddClient,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
