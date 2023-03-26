import { createStyles } from "@mantine/core";

export const useBudgetBreakdownStyles = createStyles((theme) => ({
  noInfo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[8],
  },
  item: {
    padding: 8,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
    backgroundColor: theme.colors.dark[6],
    border: "1px solid transparent",
    transition: `all 1s ease-out`,
  },
  itemFlash: {
    border: `1px solid ${theme.colors.gray[6]}`,
    backgroundColor: theme.colors.dark[4],
  },
  badge: {
    display: "flex",
    gap: theme.spacing.xs,
    alignItems: "center",
    marginRight: "auto",
  },
}));
