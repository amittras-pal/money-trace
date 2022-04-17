import { useMutation } from "react-query";
import { loginUser, signUp } from "../api/auth.api";

export function useLogin(options) {
  return useMutation(loginUser, options);
}

export function useSignUp(options) {
  return useMutation(signUp, options);
}
