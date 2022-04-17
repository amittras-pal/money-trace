import { createStyles } from "@mantine/core";

export const useLoginStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.gray[3]}`,
    width: "100%",
  },
}));
