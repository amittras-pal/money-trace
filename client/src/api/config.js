import axios from "axios";
import { getAuthTokem } from "../utils/app.utils";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/",
});

instance.interceptors.request.use(function (config) {
  const token = getAuthTokem();
  if (token) config.headers["authorization"] = `Bearer ${token}`;
  return config;
});

export default instance;
