import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Layout from "./modules/layout/Layout";
import reportWebVitals from "./reportWebVitals";

const Login = lazy(() => import("./modules/auth/Login"));
const Register = lazy(() => import("./modules/auth/Register"));
const Expenses = lazy(() => import("./modules/expenses"));
const Home = lazy(() => import("./modules/home"));
const Plans = lazy(() => import("./modules/plans/Plans"));
const PlanDetails = lazy(() => import("./modules/plans/PlanDetails"));
const User = lazy(() => import("./modules/user"));
const DownloadReport = lazy(() => import("./modules/report/DownloadReport"));

const root = ReactDOM.createRoot(document.getElementById("root"));
const client = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { path: "/", index: true, element: <Home /> },
          { path: "/home", element: <Home /> },
          { path: "/expenses", element: <Expenses /> },
          { path: "/plans", element: <Plans /> },
          { path: "/plans/:id", element: <PlanDetails /> },
          { path: "/report", element: <DownloadReport /> },
          { path: "/account", element: <User /> },
        ],
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
