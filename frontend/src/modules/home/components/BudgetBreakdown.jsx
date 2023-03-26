import { Box, Button, Divider, Group, ScrollArea, Text } from "@mantine/core";
import { IconArrowRight, IconChevronUp, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { useCurrentUser } from "../../../context/user";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import { formatCurrency } from "../../../utils";
import { useSummary } from "../services";
import { useStyles } from "../styles";

export default function BudgetBreakdown({ showForm, showRecent, recents }) {
  const { budget, userData } = useCurrentUser();
  const { onError } = useErrorHandler();
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  // Handle Loading
  const { data: summary, refetch } = useSummary({
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError,
  });

  const ref = useRef();
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
    <Box className={classes.budgetWrapper} ref={ref}>
      <Text fw="bold">Summary, {dayjs().format("MMM, 'YY")}</Text>
      <Divider my="xs" />
      <ScrollArea
        mb="xs"
        h={ref.current ? (ref.current?.clientHeight * 0.75).toFixed(0) : 0}
      >
        {summary?.data?.response.summary?.map((category) => (
          <BudgetItem
            category={category._id}
            subCategories={category.subCategories}
            amount={category.spent}
            key={category._id}
          />
        ))}
      </ScrollArea>
      <Group grow mt="auto" spacing="xs" align="flex-start">
        <Group sx={{ flexDirection: "column" }} spacing="xs" align="flex-start">
          <Text color="dimmed" fz="sm">
            Total:
          </Text>
          <Divider sx={{ width: "100%" }} />
          <Text fz="sm">{formatCurrency(summary?.data?.response?.total)}</Text>
          <Text fz="sm">of {formatCurrency(budget)}</Text>
          <Text fw="bold" fz="sm">
            ({((summary?.data?.response.total / budget) * 100).toFixed(0)}%)
          </Text>
        </Group>
        <Group
          sx={{
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
          }}
          spacing="xs"
          align="flex-end"
        >
          <Button
            ml="auto"
            leftIcon={<IconPlus size={18} />}
            size="xs"
            onClick={showForm}
          >
            Add New
          </Button>
          {isMobile && recents && (
            <Button
              size="xs"
              variant="light"
              onClick={showRecent}
              rightIcon={<IconChevronUp size={18} />}
            >
              View Recent ({recents})
            </Button>
          )}
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
      </Group>
    </Box>
  );
}
