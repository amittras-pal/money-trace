import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/app.utils";

function RouteGuard({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default RouteGuard;
