import axios from 'axios';
import { loadToken } from '../utils/authStorage';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// attach token on each request *except public endpoints*
api.interceptors.request.use((config) => {
  const token = loadToken();
  const publicEndpoints = ['/leaderboards', '/threads', '/users'];

  // Jika endpoint publik, jangan tambahkan Authorization header
  if (!publicEndpoints.some((ep) => config.url.startsWith(ep)) && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
