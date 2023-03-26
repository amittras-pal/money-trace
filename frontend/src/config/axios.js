import axios from "axios";
import { getAuthToken } from "../utils";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API ? `${process.env.REACT_APP_API}` : "/",
});

instance.interceptors.request.use((ctx) => {
  const token = getAuthToken();
  if (ctx.headers && token)
    ctx.headers?.set("authorization", `Bearer ${token}`);
  return ctx;
});

export default instance;
