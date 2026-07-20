import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ||
    "https://bayou-bucket-list-api.onrender.com/api",
  timeout: 20000,
});

export default api;
