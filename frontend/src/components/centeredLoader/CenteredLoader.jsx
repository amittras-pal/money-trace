import { Box, Loader } from "@mantine/core";
import React from "react";

export default function CenteredLoader() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Loader size={200} />
    </Box>
  );
}
