import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconAlertTriangleFilled,
  IconArrowRight,
  IconChevronUp,
  IconPlus,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { useCurrentUser } from "../../../context/user";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import { formatCurrency, getPercentage } from "../../../utils";
import { useSummary } from "../services";
import { useStyles } from "../styles";

export default function BudgetBreakdown({ showForm, showRecent, recents }) {
  const { budget, userData } = useCurrentUser();
  const { onError } = useErrorHandler();
  const isMobile = useMediaMatch();
  const { classes } = useStyles();

  const {
    data: summary,
    refetch,
    isLoading,
  } = useSummary({
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

  if (isLoading)
    return (
      <Box className={classes.noInfo}>
        <Loader size={50} />
      </Box>
    );

  return (
    <Box ref={ref} className={classes.budgetWrapper}>
      <Group position="apart">
        <Text fw="bold">Summary, {dayjs().format("MMM, 'YY")}</Text>
        {getPercentage(summary?.data?.response.total, budget) > 100 && (
          <Badge
            color="red"
            variant="filled"
            size="sm"
            radius="sm"
            leftSection={
              <IconAlertTriangleFilled size={10} style={{ marginBottom: -1 }} />
            }
          >
            Budget Exceeded
          </Badge>
        )}
      </Group>
      <Divider my="xs" />
      <ScrollArea
        mb="xs"
        h={ref.current ? (ref.current?.clientHeight * 0.7).toFixed(0) : 0}
      >
        {Object.entries(summary?.data?.response.summary)?.map(
          ([category, data]) => (
            <BudgetItem
              category={category}
              subCategories={data.subCategories}
              total={data.total}
              key={category}
            />
          )
        )}
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
            ({getPercentage(summary?.data?.response.total, budget)}%)
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
