import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ??
    "https://bayou-bucket-list-api.onrender.com/api",
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;