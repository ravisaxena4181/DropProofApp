import client from '../api/client.ts';

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
  companyId: number;
  userRole: string;
  team: string;
}) => {
    console.log('BASE URL:', client.defaults.baseURL);
  const response = await client.post('/auth/register', data);
  console.log(response);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await client.post('/auth/login', data);
  return response.data;
};
