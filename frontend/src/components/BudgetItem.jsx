import {
  Badge,
  Box,
  Checkbox,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import React, { useMemo } from "react";
import { Icons } from "../constants/categories";
import { useStyles } from "../modules/home/styles";
import { formatCurrency } from "../utils";

function BudgetItem({
  category,
  subCategories,
  total,
  showSelection,
  selection,
  onSelectionChange,
}) {
  const { classes } = useStyles();
  const subItems = useMemo(() => {
    return subCategories.map((item) => ({
      ...item,
      Icon: Icons[item.icon],
    }));
  }, [subCategories]);

  return (
    <Box className={classes.item}>
      {showSelection && (
        <Checkbox
          size="sm"
          value={category}
          checked={selection.includes(category)}
          onChange={onSelectionChange}
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Group align="center" mb={2} position="apart">
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
    </Box>
  );
}

export default BudgetItem;
