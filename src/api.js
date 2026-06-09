import axios from "axios";

// ============================
// AXIOS INSTANCE
// ============================
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// ============================
// 🔥 AUTO JWT TOKEN ATTACH
// ============================
API.interceptors.request.use(

  (config) => {

    // 🔥 GET TOKEN
    const token = localStorage.getItem("token");

    console.log("🔥 TOKEN SENT:", token);

    // 🔥 IF TOKEN EXISTS
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
export const getProfileAPI = async () => {
  const res = await API.get("profile/");
  return res.data;
};

export const updateProfileAPI = async (data) => {

  const res = await API.post(
    "profile/update/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// ============================
// USER
// ============================
export const getUserAPI = async () => {
  const res = await API.get("user/");
  return res.data;
};

// ============================
// CODE RUNNER
// ============================
export const runCodeAPI = async (code, language) => {

  const res = await API.post("run/", {
    code,
    language,
  });

  return res.data;
};

// ============================
// ANALYZE
// ============================
export const analyzeCodeAPI = async (
  code,
  language
) => {

  const res = await API.post("analyze/", {
    code,
    language,
  });

  return res.data;
};

// ============================
// CHAT
// ============================
export const aiChatAPI = async (message) => {

  const res = await API.post("chat/", {
    message,
  });

  return res.data;
};

// ============================
// HISTORY
// ============================
export const getHistoryAPI = async () => {

  const res = await API.get("history/");
  return res.data;
};

// ============================
// PRACTICE
// ============================
export const getPracticeAPI = async () => {

  const res = await API.get("practice/");
  return res.data;
};

// ============================
// TEST
// ============================
export const testModeAPI = async (code) => {

  const res = await API.post("test/", {
    code,
  });

  return res.data;
};

// ============================
// EVALUATE
// ============================
export const evaluateAPI = async (
  code,
  expected_output
) => {

  const res = await API.post("evaluate/", {
    code,
    expected_output,
  });

  return res.data;
};

export default API;