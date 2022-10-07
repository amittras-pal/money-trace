import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { mantineOverrides } from "./theme/overrides";
import { QueryClient, QueryClientProvider } from "react-query";

const root = ReactDOM.createRoot(document.getElementById("root"));
const client = new QueryClient();

root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={client}>
        <MantineProvider withNormalizeCSS theme={mantineOverrides}>
          <NotificationsProvider autoClose={2500} position="top-center">
            <ModalsProvider>
              <App />
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
