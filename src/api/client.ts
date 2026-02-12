import axios from 'axios';

const API_BASE = 'https://dropproof-fkczg9e6gta6hydr.eastasia-01.azurewebsites.net/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export default client;
