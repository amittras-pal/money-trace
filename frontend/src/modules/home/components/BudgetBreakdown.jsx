import { Box, Button, Grid, Group, Text } from "@mantine/core";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { useCurrentUser } from "../../../context/user";
import { formatCurrency } from "../../../utils";
import { useSummary } from "../services";
import { useBudgetBreakdownStyles } from "../styles";

export default function BudgetBreakdown({ setShowForm }) {
  const { classes } = useBudgetBreakdownStyles();
  const { budget, userData } = useCurrentUser();

  // Handle Loading
  const { data: summary, refetch } = useSummary({
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userData) refetch();
  }, [refetch, userData]);

  if (!budget)
    return (
      <Box className={classes.noInfo}>
        <Text>Budget Info not Available.</Text>
      </Box>
    );

  return (
    <>
      <Group mb="sm" spacing={8} align="center">
        <Text fw="bold" color="orange">
          {dayjs().format("MMM, 'YY")}
        </Text>
        <Text color="dimmed" fz="sm">
          Spent: {formatCurrency(summary?.data?.response.total)} /{" "}
          {formatCurrency(budget)}{" "}
          <Text component="span" fw="bold" fz="sm">
            ({((summary?.data?.response.total / budget) * 100).toFixed(0)}%)
          </Text>
        </Text>
        <Button
          ml="auto"
          leftIcon={<IconPlus size={18} />}
          size="xs"
          onClick={() => setShowForm(true)}
        >
          Add New
        </Button>
        <Button
          size="xs"
          variant="light"
          rightIcon={<IconArrowRight size={18} />}
          component={Link}
          to="/expenses"
        >
          View All
        </Button>
      </Group>
      <Grid mb="sm" gutter="xs" columns={12}>
        {summary?.data?.response.summary?.map((category) => (
          <BudgetItem
            category={category._id}
            subCategories={category.subCategories}
            amount={category.spent}
            key={category._id}
          />
        ))}
      </Grid>
    </>
  );
}
