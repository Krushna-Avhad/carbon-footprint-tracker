import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});


  //  Attach JWT token automatically


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});


/* =================================
            AUTH APIs
================================= */

export const signup = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};


/* =================================
            USER PROFILE
================================= */

export const getProfile = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/users/me", data);
  return res.data;
};


/* =================================
            ACTIVITIES
================================= */

export const logActivity = async (activity) => {
  const res = await API.post("/activities", activity);
  return res.data;
};

export const getActivities = async (type = "All", range = "all") => {
  const res = await API.get(`/activities?type=${type}&range=${range}`);
  return res.data;
};


/* =================================
            ANALYTICS
================================= */

export const getAnalytics = async (period = "daily") => {
  const res = await API.get(`/analytics/${period}`);
  return res.data;
};


/* =================================
            GOALS
================================= */

export const createGoal = async (goal) => {
  const res = await API.post("/goals", goal);
  return res.data;
};

export const getGoals = async () => {
  const res = await API.get("/goals");
  return res.data;
};


/* =================================
            ACHIEVEMENTS
================================= */

export const getAchievements = async () => {
  const res = await API.get("/achievements");
  return res.data;
};


/* =================================
            NOTIFICATIONS
================================= */

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};


/* =================================
        SUSTAINABILITY HUB
================================= */

export const getArticles = async () => {
  const res = await API.get("/articles");
  return res.data;
};

export const getArticle = async (id) => {
  const res = await API.get(`/articles/${id}`);
  return res.data;
};


/* =================================
        RECOMMENDATIONS
================================= */

export const getRecommendations = async () => {
  const res = await API.get("/recommendations");
  return res.data;
};