import axios from "axios";
import { getAuthToken } from "../utils";
import { getBaseURL } from "../environment";

const instance = axios.create({
  baseURL: getBaseURL(),
});

instance.interceptors.request.use((ctx) => {
  const token = getAuthToken();
  if (ctx.headers && token)
    ctx.headers?.set("authorization", `Bearer ${token}`);
  return ctx;
});

export default instance;
