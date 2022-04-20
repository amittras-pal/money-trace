import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../views/dashboard/Dashboard";
import Login from "../views/login/Login";
import RouteGuard from "./RouteGuard";

const Transactions = lazy(() => import("../views/transactions/Transactions"));
const SignUp = lazy(() => import("../views/signUp/SignUp"));
const User = lazy(() => import("../views/user/User"));
const Reports = lazy(() => import("../views/reports/Reports"));
const ReportExpenses = lazy(() => import("../views/reports/ReportExpenses"));

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
        path="/transactions"
        element={
          <RouteGuard>
            <Transactions />
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
      <Route
        path="/reports"
        element={
          <RouteGuard>
            <Reports />
          </RouteGuard>
        }
      />
      <Route
        path="/report/:id"
        element={
          <RouteGuard>
            <ReportExpenses />
          </RouteGuard>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default RouterOutlet;
