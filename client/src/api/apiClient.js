import axios from "axios";
import { store } from "../store/store";
import { clearCredentials } from "../features/auth/authSlice";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[API Request]", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response) => {
    console.log("[API Response]", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error("[API Response Error]", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      response: error.response?.data,
    });
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear credentials and redirect to login
      store.dispatch(clearCredentials());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
