// src/config/api.js

/**
 * API Configuration
 * -----------------
 * This file provides a single source of truth for your backend URL.
 *
 * Local Development:
 * VITE_API_URL=http://localhost:4000
 *
 * Production (Render):
 * VITE_API_URL=https://ifex-backend.onrender.com
 */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

/**
 * Build a complete API endpoint.
 * Example:
 * api('/api/contact')
 * => https://ifex-backend.onrender.com/api/contact
 */
export const api = (path = "") => {
  return `${API_URL}${path}`;
};

export default API_URL;