import { Group, Loader } from "@mantine/core";
import React from "react";

function LoaderOverlay() {
  return (
    <Group
      position="center"
      sx={{
        height: "100%",
        alignItems: "center",
      }}>
      <Loader size={100} color="indigo" />
    </Group>
  );
}

export default LoaderOverlay;
