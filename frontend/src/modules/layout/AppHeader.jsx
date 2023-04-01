import {
  Burger,
  Header,
  Image,
  MediaQuery,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import { useAppStyles } from "./styles";
import logo from "../../resources/app-logo.svg";

export default function AppHeader({ open, setOpen }) {
  const { classes } = useAppStyles();
  const theme = useMantineTheme();
  return (
    <Header height={60} className={classes.header}>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          opened={open}
          onClick={() => setOpen((o) => !o)}
          size="sm"
          color={theme.colors.gray[6]}
          mr="md"
        />
      </MediaQuery>
      <ThemeIcon
        color="gray"
        mr={8}
        size={28}
        variant="outline"
        sx={(theme) => ({ borderColor: theme.colors.dark[4] })}
      >
        <Image src={logo} />
      </ThemeIcon>
      <Text fz="lg" fw="bold" component={Link} to="/">
        {APP_TITLE}
      </Text>
    </Header>
  );
}
