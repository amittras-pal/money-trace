import { Grid, Skeleton } from "@mantine/core";
import React from "react";

export default function ExpenseListSkeleton() {
  return (
    <>
      <Grid.Col md={4}>
        <Skeleton height={100} mb="sm" width="100%" radius="md" />
      </Grid.Col>
      <Grid.Col md={4}>
        <Skeleton height={100} mb="sm" width="100%" radius="md" />
      </Grid.Col>
      <Grid.Col md={4}>
        <Skeleton height={100} mb="sm" width="100%" radius="md" />
      </Grid.Col>
      <Grid.Col md={4}>
        <Skeleton height={100} mb="sm" width="100%" radius="md" />
      </Grid.Col>
    </>
  );
}
