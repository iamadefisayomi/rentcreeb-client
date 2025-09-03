import { NEXT_PUBLIC_BASE_URL } from "@/constants";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
