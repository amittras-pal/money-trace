import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import Dashboard from "../../views/dashboard/Dashboard";
import Login from "../../views/login/Login";
import NewBudget from "../../views/newBudget/NewBudget";
import CenteredLoader from "../centeredLoader/CenteredLoader";
import { AuthGuard, GuestGuard } from "./RouteGuard";

const TransactionsList = lazy(() =>
  import("../../views/transactionsList/TransactionsList")
);
const User = lazy(() => import("../../views/user/User"));
const SignUp = lazy(() => import("../../views/signUp/SignUp"));
const PlansList = lazy(() => import("../../views/plannedExpenses/PlansList"));
const PlanDetails = lazy(() =>
  import("../../views/plannedExpenses/PlanDetails")
);

function RouterOutlet() {
  const { loadingRequisites, cMBudget, loggedIn } = useAuth();

  if (loadingRequisites) return <CenteredLoader />;
  if (loggedIn && !loadingRequisites && !cMBudget) return <NewBudget />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/transactions"
        element={
          <AuthGuard>
            <TransactionsList />
          </AuthGuard>
        }
      />
      <Route
        path="/expense-plans"
        element={
          <AuthGuard>
            <PlansList />
          </AuthGuard>
        }
      />
      <Route
        path="/expense-plans/:id"
        element={
          <AuthGuard>
            <PlanDetails />
          </AuthGuard>
        }
      />
      <Route
        path="/me"
        element={
          <AuthGuard>
            <User />
          </AuthGuard>
        }
      />
      <Route
        path="/login"
        element={
          <GuestGuard>
            <Login />
          </GuestGuard>
        }
      />
      <Route
        path="/sign-up"
        element={
          <GuestGuard>
            <SignUp />
          </GuestGuard>
        }
      />
    </Routes>
  );
}

export default RouterOutlet;
