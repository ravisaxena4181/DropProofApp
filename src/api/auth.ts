import client from './client.ts';

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
  console.log(response);
  return response.data;
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  console.log(data);
  const response = await client.post('/auth/login', data);
  return response.data;
};

export const getOrders = async () => {
  const response = await client.get('/orders');
  console.log(response.data[0]);
  return response.data.data;
};

