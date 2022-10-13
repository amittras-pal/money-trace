import axios from "axios";
import { getAuthToken } from "../utils/auth.utils";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/",
});

instance.interceptors.request.use(function (config) {
  const token = getAuthToken();
  if (token) config.headers["authorization"] = `Bearer ${token}`;
  return config;
});

export default instance;
