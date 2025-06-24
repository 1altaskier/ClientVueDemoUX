import axios from 'axios';
import type { Client } from '../types.ts';

// Define the Client type (adjust fields as needed)
/*
export interface Client {
  id: number
  name: string
  email: string
  phone: string
  // Add other fields based on your model
}
  */

const API_URL = 'https://localhost:7242/api/Clients'; // Change to your actual API

export const getClients = () => axios.get<Client[]>(API_URL)

export const getClient = (id: number) =>
  axios.get<Client>(`${API_URL}/${id}`)

export const createClient = (client: Omit<Client, 'id'>) =>
  axios.post<Client>(API_URL, client)

export const updateClient = (id: number, client: Client) =>
  axios.put<Client>(`${API_URL}/${id}`, client)

export const deleteClient = (id: number) =>
  axios.delete<void>(`${API_URL}/${id}`)
