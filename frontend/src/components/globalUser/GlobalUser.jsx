import {
  ActionIcon,
  Box,
  Group,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconAdjustments, IconPower } from "@tabler/icons";
import React from "react";

export default function GlobalUser() {
  const theme = useMantineTheme();
  //TODO: Add Logout behaviour.
  return (
    <Box
      px="sm"
      py="md"
      sx={{
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}>
      <Group>
        <Box sx={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            Amy Horsefighter
          </Text>
          <Text color="dimmed" size="xs">
            ahorsefighter@gmail.com
          </Text>
        </Box>

        <Tooltip position="top" label="User Settings">
          <ActionIcon color="indigo" size="lg" radius="xl" variant="light">
            <IconAdjustments size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip position="top" label="Sign Out">
          <ActionIcon color="red" size="lg" radius="xl" variant="light">
            <IconPower size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
}
