const BASE = import.meta.env.VITE_API_URL || 'https://aizazaliafridi.com/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token   = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

/* ── Auth ── */
export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
};

/* ── Public posts ── */
export const postsApi = {
  list:    (params = {}) => request('/posts?' + new URLSearchParams(params)),
  getBySlug: (slug)      => request(`/posts/${slug}`),
  categories: ()         => request('/posts/categories/all'),
};

/* ── Admin posts ── */
export const adminPostsApi = {
  all:    ()           => request('/posts/admin/all'),
  get:    (id)         => request(`/posts/admin/${id}`),
  create: (data)       => request('/posts',   { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data)   => request(`/posts/${id}`, { method: 'PUT',  body: JSON.stringify(data) }),
  delete: (id)         => request(`/posts/${id}`, { method: 'DELETE' }),
};

/* ── Portfolio ── */
export const portfolioApi = {
  list:       ()           => request('/portfolio'),
  get:        (id)         => request(`/portfolio/${id}`),
  getBySlug:  (slug)       => request(`/portfolio/slug/${slug}`),
  create:     (data)       => request('/portfolio',       { method: 'POST',   body: JSON.stringify(data) }),
  update:     (id, data)   => request(`/portfolio/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  delete:     (id)         => request(`/portfolio/${id}`, { method: 'DELETE' }),
};

/* ── Site Services ── */
export const siteServicesApi = {
  list:   ()        => request('/siteservices'),
  create: (data)    => request('/siteservices',    { method: 'POST',   body: JSON.stringify(data) }),
  update: (id, data)=> request(`/siteservices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)      => request(`/siteservices/${id}`, { method: 'DELETE' }),
};

/* ── Testimonials ── */
export const testimonialsApi = {
  list:   ()        => request('/testimonials'),
  create: (data)    => request('/testimonials',    { method: 'POST',   body: JSON.stringify(data) }),
  update: (id, data)=> request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id)      => request(`/testimonials/${id}`, { method: 'DELETE' }),
};

/* ── Uploads ── */
export const uploadsApi = {
  /* Upload cover or inline image — returns { url } */
  uploadImage: async (file) => {
    const form = new FormData();
    form.append('image', file);
    const token = getToken();
    const res = await fetch(`${BASE}/uploads/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error('Image upload failed');
    return res.json();
  },

  /* Attach a downloadable file to a post */
  uploadDownload: async (postId, file, label) => {
    const form = new FormData();
    form.append('file', file);
    form.append('label', label);
    const token = getToken();
    const res = await fetch(`${BASE}/uploads/download/${postId}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error('File upload failed');
    return res.json();
  },

  deleteDownload: (id) => request(`/uploads/download/${id}`, { method: 'DELETE' }),
};
