import { Text } from "@mantine/core";
import React from "react";
import { APP_VERSION } from "../../constants/app.constants";

export default function VersionDisplay() {
  return (
    <Text
      sx={(theme) => ({
        position: "fixed",
        bottom: theme.spacing.sm,
        width: `calc(100% - ${2 * theme.spacing.md}px)`,
      })}
      align="center"
      size="xs"
      color="dimmed">
      {APP_VERSION}
    </Text>
  );
}
