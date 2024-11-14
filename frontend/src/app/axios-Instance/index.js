import axios from "axios";
import { baseURL } from "./constants";
import { getLoginToken, getRefreshToken } from "../storage";
import { useRouter } from "next/router"; // Importing useRouter from Next.js

const config = { baseURL: baseURL };
export const axiosInstance = axios.create(config);

// Add request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLoginToken();
    if (token) {
      config.headers['token'] = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 and retry with refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized, and it's not already retried, try with the refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Set retry flag to prevent infinite loop

      // Get the refresh token
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // Update headers with refresh token
        originalRequest.headers['token'] = `${refreshToken}`;

        // Retry the original request with the refresh token
        try {
          return await axiosInstance(originalRequest);
        } catch (refreshError) {
          // If the refresh token also fails, log the user out
          if (refreshError.response && refreshError.response.status === 401) {
            // Redirect to the login page on 401 Unauthorized error
            const router = useRouter(); // Initialize router here
            router.push("/login"); // Redirect to login page

          }
          return Promise.reject(refreshError);
        }
      }
    }
    // Reject other errors or if no refresh token is available
    return Promise.reject(error);
  }
);;
