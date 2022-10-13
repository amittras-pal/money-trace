import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import Dashboard from "../../views/dashboard/Dashboard";
import Login from "../../views/login/Login";
import NewBudget from "../../views/newBudget/NewBudget";
import PlanDetails from "../../views/plannedReports/PlanDetails";
import PlansList from "../../views/plannedReports/PlansList";
import SignUp from "../../views/signUp/SignUp";
import TransactionsList from "../../views/transactionsList/TransactionsList";
import User from "../../views/user/User";
import CenteredLoader from "../centeredLoader/CenteredLoader";
import { AuthGuard, GuestGuard } from "./RouteGuard";

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
