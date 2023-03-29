import { Badge, Box, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import React, { memo, useMemo } from "react";
import { getColor, getIcons } from "../constants/categories";
import { useStyles } from "../modules/home/styles";
import { formatCurrency } from "../utils";

function BudgetItem({ amount, category, subCategories }) {
  const { classes } = useStyles();
  const { color, icons } = useMemo(
    () => ({
      color: getColor(category),
      icons: getIcons(category, subCategories),
    }),
    [category, subCategories]
  );

  return (
    <Box className={classes.item}>
      <Group position="apart" align="center" mb={2}>
        <Badge color={color} size="sm" radius="sm">
          {category}
        </Badge>
        <Text fw="bold">{formatCurrency(amount)}</Text>
      </Group>
      <Group spacing={6}>
        {icons.map(({ Icon, label }) => (
          <Tooltip
            label={label}
            withArrow
            key={label}
            events={{ hover: true, touch: true }}
          >
            <ThemeIcon size="sm" variant="light" color={color}>
              <Icon size={18} />
            </ThemeIcon>
          </Tooltip>
        ))}
      </Group>
      {/* <Text
        fz="xs"
        color="orange"
        ml="auto"
        component={Link}
        to={{
          pathname: "/expenses",
          search: new URLSearchParams({ category }).toString(),
        }}
      >
        View Expenses
        <IconArrowRight size={12} style={{ marginLeft: 4, marginBottom: -2 }} />
      </Text> */}
    </Box>
  );
}

export default memo(
  BudgetItem,
  (prev, next) =>
    prev.amount === next.amount &&
    JSON.stringify(prev.subCategories) === JSON.stringify(next.subCategories)
);
