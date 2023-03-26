import { createStyles } from "@mantine/core";

export const useAppStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.md,
    boxShadow: theme.shadows.sm,
  },
  navigation: {
    boxShadow: theme.shadows.sm,
  },
}));
