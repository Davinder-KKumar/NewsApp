const BASE = ""; // dev uses Vite proxy; set VITE_API_ORIGIN for prod if needed

async function apiJson(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) throw (isJson ? body : { error: res.statusText });
  return body;
}

// Auth
export const register = (data) =>
  apiJson("/api/auth/register", { method: "POST", body: JSON.stringify(data) });

export const login = (data) =>
  apiJson("/api/auth/login", { method: "POST", body: JSON.stringify(data) });

// Subscribers (Footer)
export const subscribe = (email) =>
  apiJson("/api/subscribers", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

// News proxy
export const topHeadlines = ({ q, country = "in", pageSize = 30 }) =>
  apiJson(`/api/news/top?q=${encodeURIComponent(q)}&country=${country}&pageSize=${pageSize}`);

export const searchNews = ({ q, language = "en", sortBy = "publishedAt", pageSize = 30 }) =>
  apiJson(
    `/api/news/search?q=${encodeURIComponent(q)}&language=${language}&sortBy=${sortBy}&pageSize=${pageSize}`
  );

// Admin newsletters
export const listNewsletters = ({ page = 0, size = 10, sort = "date", dir = "desc", category = "all" }) =>
  apiJson(
    `/api/newsletters?page=${page}&size=${size}&sort=${sort}&dir=${dir}&category=${category}`
  );

export const createNewsletter = (payload) =>
  apiJson("/api/newsletters", { method: "POST", body: JSON.stringify(payload) });

export const updateNewsletter = (id, payload) =>
  apiJson(`/api/newsletters/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteNewsletter = (id) =>
  apiJson(`/api/newsletters/${id}`, { method: "DELETE" });

export default apiJson;
