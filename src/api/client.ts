import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'https://dropproof-fkczg9e6gta6hydr.eastasia-01.azurewebsites.net/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

client.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default client;
