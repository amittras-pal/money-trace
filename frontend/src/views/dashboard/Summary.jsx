import {
  Badge,
  Box,
  Button,
  Group,
  Text,
  ThemeIcon,
  Tooltip as MTooltip,
  useMantineTheme,
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
import { useAuth } from "../../context/UserContext";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useExpenseSummary } from "../../services/expense.service";
import { percentage, severityColor } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

// TODO: Add Empty State.
export default function Summary({ onAddNew }) {
  const { onError } = useErrorHandler();
  const { breakpoints, colors } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
  const { cMBudget } = useAuth();

  const { data: summary, isLoading: loadingSummary } = useExpenseSummary(
    dayjs().month() + 1,
    dayjs().year(),
    { onError, enabled: !!cMBudget }
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

    if (cMBudget > summary?.data?.response?.total)
      chartSections.push({
        name: "Available Budget",
        value: cMBudget - summary?.data?.response?.total,
        color: colors.dark[6],
      });
    return chartSections;
  }, [colors, summary, cMBudget]);

  const recordedCategories = useMemo(() => {
    return summary?.data?.response.categories?.map?.((item) => item.name) ?? [];
  }, [summary]);

  const percentageSpent = useMemo(() => {
    const spent = summary?.data?.response?.total ?? 0;
    const setBudget = cMBudget ?? 0;
    return percentage(spent, setBudget);
  }, [cMBudget, summary]);

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

  if (!cMBudget || loadingSummary) return <CenteredLoader />;

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
        {cMBudget <= summary?.data?.response?.total && (
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
              of {currencyFormat.format(cMBudget ?? 0)}
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
