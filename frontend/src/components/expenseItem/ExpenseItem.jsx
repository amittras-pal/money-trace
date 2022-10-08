import {
  Badge,
  Box,
  createStyles,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons";
import React from "react";
import { CATEGORIES } from "../../constants/app.constants";
import { getDayString } from "../../utils/app.utils";
import { currencyFormat } from "../../utils/formatter.utils";

export default function ExpenseItem({ data }) {
  const { classes } = useCardStyle({ category: data?.category });
  return (
    <Box className={classes.card}>
      <Text weight={500} lineClamp={2}>
        {data.reverted && (
          <ThemeIcon mr="xs" color="red" size={18} variant="filled" radius="lg">
            <IconArrowBackUp size={14} />
          </ThemeIcon>
        )}
        {data.title}
      </Text>
      <Text size="sm" color="dimmed">
        {data.description}
      </Text>
      <Group spacing={0} sx={{ alignItems: "center" }}>
        <Text weight={500} lineClamp={1} size="lg" mt={6} mr={12}>
          {currencyFormat.format(data.amount)}
        </Text>
        <Badge
          color={CATEGORIES[data.category].color}
          variant="light"
          size="sm"
          mr={8}>
          {data.category}
        </Badge>
        <Badge color="gray" variant="light" size="sm">
          {getDayString(data.expenseDate)}
        </Badge>
      </Group>
    </Box>
  );
}

const useCardStyle = createStyles((theme, { category }) => ({
  card: {
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.dark[6],
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    paddingLeft: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
    position: "relative",
    "&:not(:last-child)": {
      marginBottom: theme.spacing.sm,
    },
    "&:before": {
      content: "''",
      height: "90%",
      width: 4,
      borderRadius: "4px",
      position: "absolute",
      top: "50%",
      left: 7,
      transform: "translateY(-50%)",
      backgroundColor: theme.colors[CATEGORIES[category].color][5],
    },
  },
}));
