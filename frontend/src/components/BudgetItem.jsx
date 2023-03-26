import {
  Badge,
  Box,
  Grid,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import React, { memo, useMemo } from "react";
import { getColor, getIcons } from "../constants/categories";
import useChangeFlash from "../hooks/useChangeFlash";
import { useBudgetBreakdownStyles } from "../modules/home/styles";
import { formatCurrency } from "../utils";

function BudgetItem({ amount, category, subCategories }) {
  const { classes, cx } = useBudgetBreakdownStyles();
  const changed = useChangeFlash(amount);
  const { color, icons } = useMemo(
    () => ({
      color: getColor(category),
      icons: getIcons(category, subCategories),
    }),
    [category, subCategories]
  );

  return (
    <Grid.Col xs={6} sm={6} md={4} lg={3}>
      <Box className={cx(classes.item, { [classes.itemFlash]: changed })}>
        <Group position="apart" align="center" mb={2}>
          <Badge color={color} size="sm" radius="sm">
            {category}
          </Badge>
          <Text fw="bold">{formatCurrency(amount)}</Text>
        </Group>
        <Group spacing={8}>
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
      </Box>
    </Grid.Col>
  );
}

export default memo(BudgetItem, (prev, next) => prev.amount === next.amount);
