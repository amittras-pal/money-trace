import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../../views/dashboard/Dashboard";
import Login from "../../views/login/Login";
import Detail from "../../views/plannedReports/Detail";
import List from "../../views/plannedReports/List";
import SignUp from "../../views/signUp/SignUp";
import TransactionsList from "../../views/transactionsList/TransactionsList";
import User from "../../views/user/User";
import { AuthGuard, GuestGuard } from "./RouteGuard";

function RouterOutlet() {
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
        path="/planned-reports"
        element={
          <AuthGuard>
            <List />
          </AuthGuard>
        }
      />
      <Route
        path="/planned-reports/:id"
        element={
          <AuthGuard>
            <Detail />
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
