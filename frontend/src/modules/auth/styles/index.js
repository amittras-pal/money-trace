import { createStyles } from "@mantine/core";

export const useAuthStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    width: "100vw",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  paper: {
    minWidth: "340px",
    textAlign: "start",
    padding: theme.spacing.md,
    boxShadow: theme.shadows.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: theme.colors.gray[8],
    borderRadius: theme.radius.md,
  },
  chipGroup: {
    gap: theme.spacing.xs,
  },
}));
