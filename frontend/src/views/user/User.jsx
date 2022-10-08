import { Text } from "@mantine/core";
import React from "react";
import { useAuth } from "../../context/UserContext";

export default function User() {
  const { userData } = useAuth();
  return <Text component="pre">{JSON.stringify(userData, null, 2)}</Text>;
}
