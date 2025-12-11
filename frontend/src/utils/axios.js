import axios from 'axios';
import { BASE_URL } from './constant';
const apiInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiInstance;
