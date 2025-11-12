import axios from "axios";
import { loadToken } from "../utils/authStorage";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "/api"
    : "https://forum-api.dicoding.dev/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = loadToken();
  const publicEndpoints = ["/leaderboards", "/threads", "/users"];

  if (!publicEndpoints.some((ep) => config.url.startsWith(ep)) && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
