import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Progress,
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
import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { useCurrentUser } from "../../../context/user";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import {
  formatCurrency,
  getPercentage,
  getSeverityColor,
} from "../../../utils";
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
  } = useSummary(null, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError,
  });

  const ref = useRef();
  useEffect(() => {
    if (userData) refetch();
  }, [refetch, userData]);

  const { percColor, percSpent } = useMemo(
    () => ({
      percSpent: getPercentage(summary?.data?.response.total, budget),
      percColor: getSeverityColor(summary?.data?.response.total, budget),
    }),
    [budget, summary?.data?.response.total]
  );

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
        <Text fw="bold">{dayjs().format("MMM, 'YY")}</Text>
        {summary?.data?.response?.total > budget && (
          <Badge
            color="red"
            variant="filled"
            size="sm"
            radius="sm"
            leftSection={
              <IconAlertTriangleFilled size={10} style={{ marginBottom: -1 }} />
            }
          >
            Budget Exceeded:{" "}
            {formatCurrency(summary?.data?.response?.total - budget)}
          </Badge>
        )}
      </Group>
      <Divider my="xs" />
      {Object.entries(summary?.data?.response.summary ?? {})?.map(
        ([category, data]) => (
          <BudgetItem
            category={category}
            subCategories={data.subCategories}
            total={data.total}
            key={category}
          />
        )
      )}
      <Group grow mt="auto" spacing="xs" align="flex-start">
        <Group
          sx={{
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
          h="100%"
          spacing={6}
        >
          <Group position="apart" w="100%">
            <Text color="dimmed" fz="sm" fw="bold">
              Spent:
            </Text>
            <Text fz="sm" fw="bold" color={percColor} ml="xs">
              ({percSpent}%)
            </Text>
          </Group>
          <Progress size="xs" value={percSpent} color={percColor} w="100%" />
          <Text fz="sm">{formatCurrency(summary?.data?.response?.total)}</Text>
          <Text fz="sm">of {formatCurrency(budget)}</Text>
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
