import axios from 'axios';
//import type { Client } from '../types.ts';


//const API_URL = 'https://localhost:7242/api/Clients'; // Change to your actual API

export const getClients = () => axios.get('/api/clients')
export const getClient = (id: number) => axios.get(`/api/clients/${id}`)
export const addClient = (data: any) => axios.post('/api/clients', data)
export const updateClient = (id: any, data: any) => axios.put(`/api/clients/${id}`, data)
export const deleteClient = (id: any) => axios.delete(`/api/clients/${id}`)
