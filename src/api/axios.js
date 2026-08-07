import axios from 'axios';
const api = axios.create({
  baseurl: import.meta.env.VITE_API_URL
});

export default api;