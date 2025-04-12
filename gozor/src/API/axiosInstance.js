import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://cityroots.runasp.net/api", 
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor لإضافة التوكن من الـ cookies قبل كل request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token"); // اسم الكوكي
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
