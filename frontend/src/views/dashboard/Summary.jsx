import {
  Badge,
  Box,
  Button,
  Group,
  Text,
  ThemeIcon,
  useMantineTheme,
  Tooltip as MTooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertOctagon, IconArrowRight, IconPlus } from "@tabler/icons";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import ChartTooltip from "../../components/charts/ChartTooltip";
import { CATEGORIES } from "../../constants/app.constants";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useBudget } from "../../services/budget.service";
import { useExpenseSummary } from "../../services/expense.service";
import { percentage, severityColor } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

// TODO: Add Empty State.
export default function Summary({ onAddNew }) {
  const { onError } = useErrorHandler();
  const { breakpoints, colors } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  // TODO: Add error hanler if budget is not set.
  // Open the create budget popup.
  const { isLoading: loadingBudget, data: budget } = useBudget(
    new Date().getMonth() + 1,
    new Date().getFullYear(),
    { refetchOnWindowFocus: false, onError }
  );

  const { data: summary, isLoading: loadingSummary } = useExpenseSummary(
    new Date().getMonth() + 1,
    new Date().getFullYear(),
    { onError, enabled: !!budget }
  );

  const sections = useMemo(() => {
    const expenseCats = summary?.data?.response?.categories ?? [];
    const chartSections = [];
    if (expenseCats?.length > 0)
      expenseCats.forEach((category) => {
        chartSections.push({
          ...category,
          // TODO: Store only the color name; this would make grabbing color for tooltip border easier.
          color: colors[CATEGORIES[category.name].color][5],
        });
      });

    if (budget?.data?.response?.amount > summary?.data?.response?.total)
      chartSections.push({
        name: "Available Budget",
        value: budget?.data?.response?.amount - summary?.data?.response?.total,
        color: colors.dark[6],
      });
    return chartSections;
  }, [colors, summary, budget]);

  const recordedCategories = useMemo(() => {
    return summary?.data?.response.categories?.map?.((item) => item.name) ?? [];
  }, [summary]);

  const percentageSpent = useMemo(() => {
    const spent = summary?.data?.response?.total ?? 0;
    const setBudget = budget?.data?.response?.amount ?? 0;
    return percentage(spent, setBudget);
  }, [budget, summary]);

  const getCategoryAmount = useCallback(
    (category) => {
      return !recordedCategories.includes(category)
        ? "---"
        : currencyFormat.format(
            summary?.data?.response.categories.find((o) => o.name === category)
              .value
          );
    },
    [summary, recordedCategories]
  );

  if (loadingBudget || loadingSummary) return <CenteredLoader />;

  return (
    <>
      <Box sx={{ width: "100%", height: "60%", position: "relative" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={sections}
              innerRadius={isMobile ? 45 : 70}
              startAngle={90}
              endAngle={450}
              paddingAngle={3}
              autoReverse
              dataKey="value">
              {sections.map((section) => (
                <Cell
                  style={{ cursor: "pointer" }}
                  key={section.name}
                  fill={section.color}
                  stroke={colors.dark[2]}
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
        {budget?.data?.response?.amount <= summary?.data?.response?.total && (
          <MTooltip
            label="Budget Exceeded"
            withArrow
            color="red"
            position="left"
            opened={true}>
            <ThemeIcon
              color="red"
              size={35}
              radius="xl"
              sx={{
                position: "absolute",
                top: isMobile ? -10 : 0,
                right: isMobile ? -10 : 0,
              }}>
              <IconAlertOctagon size={20} />
            </ThemeIcon>
          </MTooltip>
        )}
      </Box>
      <Box sx={{ width: "100%", marginTop: "auto" }}>
        <Group
          spacing="sm"
          position="center"
          align="flex-end"
          grow
          sx={{ width: "100%" }}>
          <Group
            spacing={4}
            sx={() => ({
              flexShrink: 1,
              flexDirection: "column",
              alignItems: "flex-start",
            })}>
            {Object.entries(CATEGORIES).map(([name]) => (
              <Badge
                size="sm"
                color={CATEGORIES[name].color}
                variant={recordedCategories.includes(name) ? "filled" : "dot"}
                // TODO: Navigate to transactions with filter
                // onClick={() => navigateToFilteredTransactions(name)}
                key={name}>
                {name}: {getCategoryAmount(name)}
              </Badge>
            ))}
          </Group>
          <Group
            spacing={"xs"}
            sx={() => ({
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              height: "100%",
            })}>
            <Text size="sm" color={colors.indigo[4]} weight="bold" mb={4}>
              Summary {dayjs().format("MMM, 'YY")}
            </Text>
            <Text size="sm" weight="bold" align="end">
              Spent {currencyFormat.format(summary?.data?.response.total)}
            </Text>
            <Text size="sm" align="end" weight={500}>
              <Text
                component="span"
                color={colors[severityColor(percentageSpent)][5]}>
                {percentageSpent}%
              </Text>{" "}
              of {currencyFormat.format(budget?.data?.response?.amount ?? 0)}
            </Text>
            <Button
              color="indigo"
              size="xs"
              variant="subtle"
              pr={0}
              component={Link}
              to="/transactions"
              rightIcon={<IconArrowRight size={18} />}>
              View All
            </Button>
            <Button
              color="indigo"
              size="xs"
              leftIcon={<IconPlus size={18} />}
              onClick={onAddNew}
              mt="auto">
              Add New
            </Button>
          </Group>
        </Group>
      </Box>
    </>
  );
}
