import { Box, Text } from "@mantine/core";
import React from "react";
import RPinInput from "react-pin-input";
import "./PinInput.scss";

export default function PinInput({ label, error, required, ...props }) {
  return (
    <Box mb="md" className={`pi-mod ${error ? "invalid" : ""}`}>
      <Text fz="sm" fw={500} mb={2}>
        {label}{" "}
        {required ? (
          <Text component="span" c="red">
            *
          </Text>
        ) : (
          ""
        )}
      </Text>
      <RPinInput {...props} type="numeric" />
      {error && (
        <Text fz="xs" c="red">
          {error}
        </Text>
      )}
    </Box>
  );
}
