import client from './client.ts';
import { useAuthStore } from '../store/useStore.ts';

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
  companyId: number;
  userRole: string;
  team: string;
}) => {
  console.log(data);
  const response = await client.post('/auth/register', data);
  const { setAuth } = useAuthStore.getState();
  setAuth(response.data.data.token,response.data.data.user);
  return response.data;
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const response = await client.post('/auth/login', data);
  const { setAuth } = useAuthStore.getState();
  setAuth(response.data.data.token,response.data.data.user);
  return response.data;
};

export const getOrders = async () => {
  const response = await client.get('/orders');
  return response.data.data;
};

export const getOrderById = async (id: number) => {
  const response = await client.get(`/orders/${id}`);
  return response.data.data; 
};
