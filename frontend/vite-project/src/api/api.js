import axios from "axios";

const API_URL = "http://localhost:5000"; // Adjust to your backend URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // For cookie-based auth (verifyToken)
});

// Add token to headers if using authMiddleware
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveProducts = (products) => api.post("/save-products", { products });
export const getProducts = () => api.get("/"); // For fetching all products

export default api;