import {
  Burger,
  Header,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { APP_TITLE } from "../../constants/app";
import { useAppStyles } from "./styles";

export default function AppHeader({ open, setOpen }) {
  const { classes } = useAppStyles();
  const theme = useMantineTheme();
  return (
    <Header height={50} className={classes.header}>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          opened={open}
          onClick={() => setOpen((o) => !o)}
          size="sm"
          color={theme.colors.gray[6]}
          mr="md"
        />
      </MediaQuery>
      <Text fz="lg" fw="bold" component={Link} to="/">
        {APP_TITLE}
      </Text>
    </Header>
  );
}
