import {
  Accordion,
  Box,
  Button,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import React from "react";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import { APP_VERSION } from "../../constants/app.constants";
import { useAuth } from "../../context/UserContext";
import ChangePassword from "./ChangePassword";

export default function User() {
  const { userData, setViewChangelog } = useAuth();
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  if (!userData) return <CenteredLoader />;

  return (
    <>
      <Text size={isMobile ? 35 : 60} weight={500}>
        {userData.name}
      </Text>
      <Text size="sm" color="dimmed">
        {userData.email}
      </Text>
      <Text size="sm" color="dimmed">
        Member Since: {dayjs(userData.createdAt).format("DD MMM, 'YY")}
      </Text>
      <Box mt="lg">
        <Accordion defaultValue="" variant="separated">
          <Accordion.Item value="passwordUpdate">
            <Accordion.Control>
              <Text weight="bold">Change Password</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <ChangePassword />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>
      <Group mt="xl" position="right">
        <Button variant="subtle" onClick={() => setViewChangelog(true)}>
          Latest features in {APP_VERSION}
        </Button>
      </Group>
    </>
  );
}
