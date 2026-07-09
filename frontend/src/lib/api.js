const ADMIN_TOKEN_KEY = 'ifex_admin_token';

// Use environment variable for API URL, fallback to the Render backend for production
const API_BASE = import.meta.env.VITE_API_URL || 'https://ifex-international-backend.onrender.com/api';
const API_ORIGIN = API_BASE.startsWith('http') ? new URL(API_BASE).origin : window.location.origin;
const PUBLIC_IMAGE_BASE = 'https://raw.githubusercontent.com/ishanmotorsnew-beep/iFeX-/main/server/uploads';

function isLocalHostname(hostname) {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname);
}

function resolveImageUrl(src) {
  if (!src) return src;
  if (src.startsWith('/uploads/')) {
    return `${PUBLIC_IMAGE_BASE}${src.replace('/uploads', '')}`;
  }
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const url = new URL(src);
      if (isLocalHostname(url.hostname)) {
        return `${PUBLIC_IMAGE_BASE}${url.pathname.replace('/uploads', '')}${url.search}${url.hash}`;
      }
      if (url.pathname.startsWith('/uploads/')) {
        return `${PUBLIC_IMAGE_BASE}${url.pathname.replace('/uploads', '')}${url.search}${url.hash}`;
      }
      return src;
    } catch {
      return src;
    }
  }
  return src;
}

function normalizeContent(payload) {
  if (!payload) return payload;
  return {
    ...payload,
    portfolio: payload.portfolio?.map((project) => ({
      ...project,
      image: resolveImageUrl(project.image),
      images: project.images?.map(resolveImageUrl) || [],
    })) || [],
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }
  return data;
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- Public ---------------------------------------------------------------

export async function fetchContent() {
  const res = await fetch(`${API_BASE}/content`);
  const data = await handleResponse(res);
  return normalizeContent(data.data);
}


export async function submitContact(values) {
  const formData = new FormData();
  formData.append('access_key', import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'de238b20-623f-4602-a6f8-9c6dd50eb1da');

  Object.entries(values).forEach(([key, value]) => {
    if (value) formData.append(key, String(value));
  });

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }
  return data;
}

// --- Admin auth -------------------------------------------------------------

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await handleResponse(res);
  setAdminToken(data.token);
  return data.token;
}

export async function adminLogout() {
  try {
    await fetch(`${API_BASE}/admin/logout`, { method: 'POST', headers: authHeaders() });
  } finally {
    clearAdminToken();
  }
}

export async function adminCheckSession() {
  const res = await fetch(`${API_BASE}/admin/session`, { headers: authHeaders() });
  if (!res.ok) return false;
  const data = await res.json().catch(() => ({}));
  return !!data.success;
}

// --- Admin: company ---------------------------------------------------------

export async function adminUpdateCompany(partialCompany) {
  const res = await fetch(`${API_BASE}/admin/company`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(partialCompany),
  });
  const data = await handleResponse(res);
  return data.data;
}

// --- Admin: portfolio ---------------------------------------------------------

export async function adminCreateProject(project) {
  const res = await fetch(`${API_BASE}/admin/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(project),
  });
  const data = await handleResponse(res);
  return data.data;
}

export async function adminUpdateProject(id, partialProject) {
  const res = await fetch(`${API_BASE}/admin/portfolio/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(partialProject),
  });
  const data = await handleResponse(res);
  return data.data;
}

export async function adminDeleteProject(id) {
  const res = await fetch(`${API_BASE}/admin/portfolio/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function adminUploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await handleResponse(res);
  return resolveImageUrl(data.url);
}
