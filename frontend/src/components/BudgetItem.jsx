import { Badge, Box, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import React, { useMemo } from "react";
import { Icons } from "../constants/categories";
import { useStyles } from "../modules/home/styles";
import { formatCurrency } from "../utils";

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
    </Box>
  );
}

export default BudgetItem;
