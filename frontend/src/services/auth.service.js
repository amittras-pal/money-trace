import { useMutation, useQuery } from "react-query";
import {
  changePassword,
  getUserDetails,
  loginUser,
  signUp,
  updateUser,
} from "../api/auth.api";

export function useLogin(options) {
  return useMutation(loginUser, options);
}

export function useSignUp(options) {
  return useMutation(signUp, options);
}

export function useUserData(options) {
  return useQuery("user-details", getUserDetails, options);
}

export function useUpdateUser(options) {
  return useMutation(updateUser, options);
}

export function useChangePassword(options) {
  return useMutation(changePassword, options);
}
