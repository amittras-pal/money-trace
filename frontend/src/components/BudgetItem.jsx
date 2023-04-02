import React, { memo, useMemo } from "react";
import { useStyles } from "../modules/home/styles";
import { Badge, Box, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { formatCurrency } from "../utils";
import { Icons } from "../constants/categories";

function BudgetItem({ category, subCategories, total }) {
  const { classes } = useStyles();

  const subItems = useMemo(() => {
    return subCategories.map((item) => ({
      ...item,
      Icon: Icons[item.icon],
    }));
  }, [subCategories]);

  return (
    <Box className={classes.item}>
      <Group position="apart" align="center" mb={2}>
        <Badge color={subCategories[0].color} size="sm" radius="sm">
          {category}
        </Badge>
        <Text fw="bold">{formatCurrency(total)}</Text>
      </Group>
      <Group spacing={6}>
        {subItems.map(({ label, value, color, Icon }) => (
          <Tooltip
            label={`${label}: ${formatCurrency(value)}`}
            withArrow
            key={label}
            events={{ hover: true, touch: true }}
            position="right"
          >
            <ThemeIcon size="sm" variant="light" color={color}>
              <Icon size={16} />
            </ThemeIcon>
          </Tooltip>
        ))}
      </Group>
      {/* <Text
        fz="xs"
        color={primaryColor}
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
    prev.total === next.total &&
    JSON.stringify(prev.subCategories) === JSON.stringify(next.subCategories)
);
