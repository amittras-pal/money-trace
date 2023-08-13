import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => {
  return {
    budgetWrapper: {
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[6],
      boxShadow: theme.shadows.md,
      padding: theme.spacing.sm,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    listWrapper: {
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[6],
      boxShadow: theme.shadows.md,
      padding: theme.spacing.sm,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
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
      backgroundColor: theme.colors.dark[7],
      border: "1px solid transparent",
      transition: `all 1s ease-out`,
      display: "flex",
      alignItems: "center",
      width: "100%",
      gap: 8,
    },
    badge: {
      display: "flex",
      gap: theme.spacing.xs,
      alignItems: "center",
      marginRight: "auto",
    },
  };
});
