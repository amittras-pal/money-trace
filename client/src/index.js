import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

const themeOverrides = {
  loader: "dots",
};

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={themeOverrides}>
        <NotificationsProvider autoClose={5000}>
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
