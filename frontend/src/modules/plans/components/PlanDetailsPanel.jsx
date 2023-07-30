import { Badge, Box, Divider, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";

export default function PlanDetailsPanel({ data }) {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.dark[6],
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        height: "100%",
      })}
    >
      <Text fz="lg" fw="bold">
        {data.name}
      </Text>
      <Text sx={{ whiteSpace: "pre-wrap" }}>{data.description}</Text>
      <Divider my="lg" />
      <Text fz="sm" display="flex" sx={{ alignItems: "center" }}>
        <Text component="span" color="dimmed">
          Status:{" "}
        </Text>
        <Badge
          ml={6}
          variant="light"
          component="span"
          color={data.open ? "indigo" : "red"}
        >
          {data.open ? "Open" : "Closed"}
        </Badge>
      </Text>
      <Text fz="sm">
        <Text component="span" color="dimmed">
          Created:{" "}
        </Text>
        <Text component="span" fw="bold">
          {dayjs(data.createdAt).format("DD MMM, hh:mm a")}
        </Text>
      </Text>
      <Text fz="sm">
        <Text component="span" color="dimmed">
          Last Updated:{" "}
        </Text>
        <Text component="span" fw="bold">
          {dayjs(data.updatedAt).format("DD MMM, hh:mm a")}
        </Text>
      </Text>
      <Text fz="sm">
        <Text component="span" color="dimmed">
          Last Action:{" "}
        </Text>
        <Text component="span" fw="bold">
          {data.lastAction}
        </Text>
      </Text>
    </Box>
  );
}
