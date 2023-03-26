import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../../utils";

export default function PublicGuard({ children }) {
  return getAuthToken() ? <Navigate to={-1} /> : children;
}
