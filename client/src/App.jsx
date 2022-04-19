import {
  AppShell,
  Burger,
  createStyles,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { Suspense, useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { useNavigate } from "react-router-dom";
import { X } from "tabler-icons-react";
import LoaderOverlay from "./components/LoaderOverlay";
import Navigation from "./components/Navigation";
import SignOut from "./components/SignOut";
import { APP_TITLE } from "./constants/appConstants";
import RouterOutlet from "./router/RouterOutlet";

function App() {
  // Remove this piece of code before committing.
  setInterval(() => {
    document.querySelector("iframe")?.remove();
  }, 150);

  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const interceptUnauthorized = (err) => {
    if (err.response.status === 401) {
      localStorage.clear();
      navigate("/login");
      showNotification({
        title: err.response.data.message,
        color: "red",
        icon: <X />,
      });
    }
  };

  const client = new QueryClient({
    mutationCache: new MutationCache({
      onError: interceptUnauthorized,
    }),
    queryCache: new QueryCache({
      onError: interceptUnauthorized,
    }),
  });

  const theme = useMantineTheme();
  const { classes } = useAppStyles();
  const [opened, setOpened] = useState(false);
  return (
    <QueryClientProvider client={client}>
      <AppShell
        styles={{
          main: {
            backgroundColor: theme.colors.gray[2],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}>
            <Navigation setOpened={setOpened} />
          </Navbar>
        }
        header={
          <Header height={60} p="md" className={classes.header}>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[0]}
                mr="xl"
              />
            </MediaQuery>
            <Text size="xl" weight="bold">
              {APP_TITLE}
            </Text>
            <SignOut />
          </Header>
        }>
        <Suspense fallback={<LoaderOverlay />}>
          <RouterOutlet />
        </Suspense>
      </AppShell>
    </QueryClientProvider>
  );
}

const useAppStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.indigo[6],
    boxShadow: theme.shadows.lg,
    color: theme.colors.gray[0],
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
}));

export default App;
