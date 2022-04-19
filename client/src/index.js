import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

const themeOverrides = {
  loader: "dots",
  colorScheme:
    new Date().getHours() > 20 && new Date().getHours() < 7 ? "light" : "dark",
};

const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Router>
        <MantineProvider
          withNormalizeCSS
          withGlobalStyles
          theme={themeOverrides}>
          <NotificationsProvider autoClose={5000}>
            <ModalsProvider>
              <App />
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
