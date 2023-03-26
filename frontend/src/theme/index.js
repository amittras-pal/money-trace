/** @type {import("@mantine/core").MantineTheme} */
const theme = {
  colorScheme: "dark",
  primaryColor: "orange",
  defaultRadius: "sm",
  activeStyles: { transform: "scale(0.95)" },
  // breakpoints: {
  //   xs: "12em",
  //   sm: "36em",
  //   md: "64em",
  //   lg: "74em",
  //   xl: "90em",
  // },
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
  },
};

export default theme;
