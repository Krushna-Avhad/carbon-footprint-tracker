const BASE_URL = 'http://localhost:5000/api';

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

// Auth APIs
export const signup = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const login = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return res.json();
};

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/users/me`, { headers: getAuthHeaders() });
  return res.json();
};

export const updateProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

// Activities APIs
export const logActivity = async (activity) => {
  const res = await fetch(`${BASE_URL}/activities`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(activity)
  });
  return res.json();
};

export const getActivities = async (type, range) => {
  const res = await fetch(`${BASE_URL}/activities?type=${type}&range=${range}`, { headers: getAuthHeaders() });
  return res.json();
};

// Analytics APIs
export const getAnalytics = async (period) => {
  const res = await fetch(`${BASE_URL}/analytics/${period}`, { headers: getAuthHeaders() });
  return res.json();
};

// Goals APIs
export const createGoal = async (goal) => {
  const res = await fetch(`${BASE_URL}/goals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(goal)
  });
  return res.json();
};

export const getGoals = async () => {
  const res = await fetch(`${BASE_URL}/goals`, { headers: getAuthHeaders() });
  return res.json();
};

// Achievements APIs
export const getAchievements = async () => {
  const res = await fetch(`${BASE_URL}/achievements`, { headers: getAuthHeaders() });
  return res.json();
};

// Notifications APIs
export const getNotifications = async () => {
  const res = await fetch(`${BASE_URL}/notifications`, { headers: getAuthHeaders() });
  return res.json();
};

export const markNotificationRead = async (id) => {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  return res.json();
};

// Sustainability Hub APIs
export const getArticles = async () => {
  const res = await fetch(`${BASE_URL}/articles`, { headers: getAuthHeaders() });
  return res.json();
};

export const getArticle = async (id) => {
  const res = await fetch(`${BASE_URL}/articles/${id}`, { headers: getAuthHeaders() });
  return res.json();
};