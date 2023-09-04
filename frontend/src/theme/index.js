import { primaryColor } from "../constants/app";

/** @type {import("@mantine/core").MantineTheme} */
const theme = {
  colorScheme: "dark",
  primaryColor,
  defaultRadius: "sm",
  activeStyles: { transform: "scale(0.95)" },
  components: {
    TextInput: {
      defaultProps: {
        mb: "sm",
        variant: "filled",
      },
    },
    Textarea: {
      defaultProps: {
        mb: "sm",
        variant: "filled",
      },
    },
    Select: {
      defaultProps: {
        mb: "sm",
        variant: "filled",
      },
    },
    DateTimePicker: {
      defaultProps: {
        mb: "sm",
        variant: "filled",
      },
    },
    PasswordInput: {
      defaultProps: {
        mb: "sm",
        variant: "filled",
      },
    },
    Button: {
      defaultProps: {
        loaderPosition: "right",
      },
    },
    Modal: {
      centered: true,
      lockScroll: true,
      withOverlay: true,
      overlayProps: {
        blur: 6,
      },
    },
    Divider: {
      defaultProps: {
        variant: "dashed",
      },
    },
    ScrollArea: {
      defaultProps: {
        scrollbarSize: 6,
      },
    },
  },
};

export default theme;
