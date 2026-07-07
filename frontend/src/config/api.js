// src/config/api.js

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export const api = (path = "") => {
  return `${API_URL}${path}`;
};

export default API_URL;
