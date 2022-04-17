import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../views/dashboard/Dashboard";
import Login from "../views/login/Login";
import RouteGuard from "./RouteGuard";

const Archived = lazy(() => import("../views/archive/Archived"));
const SignUp = lazy(() => import("../views/signUp/SignUp"));
const User = lazy(() => import("../views/user/User"));

function RouterOutlet() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route
        path="/home"
        element={
          <RouteGuard>
            <Dashboard />
          </RouteGuard>
        }
      />
      <Route
        path="/archive"
        element={
          <RouteGuard>
            <Archived />
          </RouteGuard>
        }
      />
      <Route
        path="/user"
        element={
          <RouteGuard>
            <User />
          </RouteGuard>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default RouterOutlet;
