// src/config/api.js

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ifex-international-backend.onrender.com/api";

export const api = (path = "") => {
  return `${API_URL}${path}`;
};

export default API_URL;
