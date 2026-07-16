import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // CRITICAL: This sends the JWT cookie to the server
});

export default instance;