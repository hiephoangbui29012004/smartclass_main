import axios from "axios";
import { toast } from "react-toastify";
import CookieService from "./CookieService";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = CookieService.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (errorr) => {
    if (errorr?.response?.data) {
      const { error, message } = errorr?.response?.data;
      if (error) {
        toast.error(error);
      }
      if (message) toast.error(message);
    }
    if (errorr?.response?.status === 401) {
      CookieService.remove("token");
      CookieService.remove("role");

      window.location.href = "/";
    }

    return Promise.reject(errorr);
  }
);

export default axiosClient;
