import axios from 'axios';

const BASE_URL = 'https://carbonfootprinttracker-backend.onrender.com/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('ahb_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auto-redirect on 401 — but ONLY for authenticated routes (not login/register)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute =
      err.config?.url?.includes('/auth/login') ||
      err.config?.url?.includes('/auth/register');

    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('ahb_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ─── AUTH ───────────────────────────────────────────────── */
export const signup  = (data) => API.post('/auth/register', data).then(r => r.data);
export const login   = (data) => API.post('/auth/login', data).then(r => r.data);
export const getProfile     = ()     => API.get('/auth/me').then(r => r.data);
export const updateProfile  = (data) => API.put('/auth/me', data).then(r => r.data);
export const changePassword = (data) => API.put('/auth/change-password', data).then(r => r.data);
export const deleteAccount  = (data) => API.delete('/auth/account', { data }).then(r => r.data);

/* ─── ACTIVITIES ─────────────────────────────────────────── */
export const logActivity    = (data)                    => API.post('/activities', data).then(r => r.data);
export const getActivities  = (type = 'All', range = 'all', search = '') =>
  API.get('/activities', { params: { type, range } }).then(r => r.data);
export const updateActivity = (id, data)                => API.put(`/activities/${id}`, data).then(r => r.data);
export const deleteActivity = (id)                      => API.delete(`/activities/${id}`).then(r => r.data);

/* ─── ANALYTICS ──────────────────────────────────────────── */
export const getAnalytics    = (period = 'monthly') => API.get(`/analytics/${period}`).then(r => r.data);
export const getMonthlyTrend = ()                   => API.get('/analytics/trend/monthly').then(r => r.data);
export const getSummary      = ()                   => API.get('/analytics/summary').then(r => r.data);

/* ─── GOALS ──────────────────────────────────────────────── */
export const createGoal      = (data) => API.post('/goals', data).then(r => r.data);
export const getGoals        = ()     => API.get('/goals').then(r => r.data);
export const getGoalProgress = ()     => API.get('/goals/progress').then(r => r.data);
export const deleteGoal      = (id)   => API.delete(`/goals/${id}`).then(r => r.data);

/* ─── ACHIEVEMENTS ───────────────────────────────────────── */
export const getAchievements = () => API.get('/achievements').then(r => r.data);

/* ─── NOTIFICATIONS ──────────────────────────────────────── */
export const getNotifications         = ()   => API.get('/notifications').then(r => r.data);
export const markNotificationRead     = (id) => API.put(`/notifications/${id}/read`).then(r => r.data);
export const markAllNotificationsRead = ()   => API.put('/notifications/mark-all-read').then(r => r.data);
export const dismissNotification      = (id) => API.delete(`/notifications/${id}`).then(r => r.data);

/* ─── ARTICLES ───────────────────────────────────────────── */
export const getArticles = (category) =>
  API.get('/articles', { params: category && category !== 'All' ? { category } : {} }).then(r => r.data);
export const getArticle  = (id) => API.get(`/articles/${id}`).then(r => r.data);

export default API;
