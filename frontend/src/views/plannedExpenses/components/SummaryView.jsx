import { Badge, Box, Group, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "../../../components/charts/ChartTooltip";
import { CATEGORIES } from "../../../constants/app.constants";
import { currencyFormat } from "../../../utils/formatter.utils";

export default function SummaryView({ data }) {
  const { breakpoints, colors } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const chartSections = useMemo(() => {
    // TODO: change this response from an object to an array; don't want to make this processing on the FE.
    const sections = Object.entries(data?.summary ?? {}).map(
      ([category, amount]) => ({
        name: category,
        value: amount,
        color: CATEGORIES[category].color,
      })
    );

    return sections;
  }, [data]);

  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.sm,
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.dark[7],
        border: `1px solid ${theme.colors.dark[5]}`,
      })}>
      <Box sx={{ height: "60%" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartSections}
              innerRadius={isMobile ? 45 : 70}
              startAngle={90}
              endAngle={450}
              paddingAngle={3}
              autoReverse
              dataKey="value">
              {chartSections.map((section) => (
                <Cell
                  style={{ cursor: "pointer" }}
                  key={section.name}
                  fill={colors[section.color][5]}
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
      </Box>
      <Group position="apart" align="flex-end" grow sx={{ height: "40%" }}>
        <Box>
          <Text size="lg">
            <Text component="span">Total: </Text>
            <Text component="span" weight={500}>
              {currencyFormat.format(data?.total)}
            </Text>
          </Text>
        </Box>
        <Group
          sx={{ flexDirection: "column", alignItems: "flex-end" }}
          spacing={4}>
          {chartSections?.map((item) => (
            <Badge size="sm" key={item.name} color={item.color}>
              {item.name}: {currencyFormat.format(item.value)}
            </Badge>
          ))}
        </Group>
      </Group>
    </Box>
  );
}
