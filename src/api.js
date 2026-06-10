import axios from "axios";

// ============================
// BASE API (BACKEND URL)
// ============================
const API = axios.create({
  baseURL: "https://ai-code-mentor-backend-0rmn.onrender.com/",
});

// ============================
// JWT INTERCEPTOR
// ============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// PROFILE
// ============================
export const getProfileAPI = () => API.get("/profile/").then(res => res.data);

export const updateProfileAPI = (data) =>
  API.post("/profile/update/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(res => res.data);

// ============================
// USER
// ============================
export const getUserAPI = () => API.get("/user/").then(res => res.data);

// ============================
// CODE RUNNER
// ============================
export const runCodeAPI = (code, language) =>
  API.post("/run/", { code, language }).then(res => res.data);

// ============================
// ANALYZE
// ============================
export const analyzeCodeAPI = (code, language) =>
  API.post("/analyze/", { code, language }).then(res => res.data);

// ============================
// CHAT
// ============================
export const aiChatAPI = (message) =>
  API.post("/chat/", { message }).then(res => res.data);

// ============================
// HISTORY
// ============================
export const getHistoryAPI = () => API.get("/history/").then(res => res.data);

// ============================
// PRACTICE
// ============================
export const getPracticeAPI = () => API.get("/practice/").then(res => res.data);

// ============================
// TEST
// ============================
export const testModeAPI = (code) =>
  API.post("/test/", { code }).then(res => res.data);

// ============================
// EVALUATE
// ============================
export const evaluateAPI = (code, expected_output) =>
  API.post("/evaluate/", { code, expected_output }).then(res => res.data);

export default API;