import { AppShell, LoadingOverlay } from "@mantine/core";
import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import AppHeader from "./AppHeader";
import AppNavigation from "./AppNavigation";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard>
      <AppShell
        header={<AppHeader open={open} setOpen={setOpen} />}
        navbar={
          <AppNavigation hidden={!open} onChange={() => setOpen(false)} />
        }
        navbarOffsetBreakpoint="sm"
        padding="md"
      >
        <Suspense fallback={<LoadingOverlay visible overlayBlur={5} />}>
          <Outlet />
        </Suspense>
      </AppShell>
    </AuthGuard>
  );
}
