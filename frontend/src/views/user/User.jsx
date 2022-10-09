import { Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import React from "react";
import { useAuth } from "../../context/UserContext";

export default function User() {
  const { userData } = useAuth();
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

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
      <Text
        mt={40}
        size={isMobile ? 24 : 40}
        weight={700}
        variant="gradient"
        gradient={{ from: "orange", to: "blue", deg: 0 }}>
        More control over user account is arriving soon, in version 3.0.
      </Text>
    </>
  );
}
