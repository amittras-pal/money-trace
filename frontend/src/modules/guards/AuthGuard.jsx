import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../../utils";

export default function AuthGuard({ children }) {
  return getAuthToken() ? children : <Navigate to="/login" />;
}
