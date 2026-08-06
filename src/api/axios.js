import axios from 'axios';
const api = axios.create({
  baseurl: "ttp://localhost:3000"
});

export default api;