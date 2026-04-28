import axios from "axios";
import { parseErrorResponse } from "./error";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.data) {
      return Promise.reject(parseErrorResponse(error.response.data));
    }
    return Promise.reject(error);
  }
);
