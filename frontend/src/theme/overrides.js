/** @type {import("@mantine/core").ModalProps} */
const modalOverRides = {
  centered: true,
  overlayBlur: 10,
  overlayColor: "#212529AA",
  overflow: "inside",
  transition: "pop",
  transitionDuration: 300,
  zIndex: 1050,
};

/** @type {import("@mantine/core").DrawerProps} */
const drawerOverrides = {
  overlayBlur: 10,
  overlayColor: "#212529AA",
  zIndex: 1000,
};

/** @type {import("@mantine/core").ButtonProps} */
const buttonOverRides = {
  size: "sm",
};

/** @type {import("@mantine/core").TextProps} */
const textOverRides = {
  color: "#F1F3F5",
};

/** @type {import("@mantine/core").TextInputProps} */
const textInputOverRides = {
  size: "sm",
  mb: "xs",
  inputWrapperOrder: ["label", "input", "error", "description"],
};

/** @type {import("@mantine/core").TextareaProps} */
const textAreaOverRides = {
  size: "sm",
  mb: "xs",
  inputWrapperOrder: ["label", "input", "error", "description"],
};

/** @type {import("@mantine/core").PasswordInputProps} */
const passwordInputOverRides = {
  size: "sm",
  mb: "xs",
  toggleTabIndex: 0,
};

/** @type {import("@mantine/core").ScrollAreaProps} */
const scrollAreaOverRides = {
  type: "scroll",
  scrollbarSize: 6,
  scrollHideDelay: 1500,
};

/** @type {import("@mantine/core").TooltipProps} */
const tooltipOverrides = {
  events: { hover: true, touch: true },
};

/** @type {import("@mantine/core").MantineThemeOverride} */
export const mantineOverrides = {
  colorScheme: "dark",
  primaryColor: "indigo",
  activeStyles: {
    transform: "scale(0.95)",
  },
  components: {
    Modal: { defaultProps: modalOverRides },
    Drawer: { defaultProps: drawerOverrides },
    Button: { defaultProps: buttonOverRides },
    TextInput: { defaultProps: textInputOverRides },
    PasswordInput: { defaultProps: passwordInputOverRides },
    ScrollArea: { defaultProps: scrollAreaOverRides },
    Text: { defaultProps: textOverRides },
    TextArea: { defaultProps: textAreaOverRides },
    Tooltip: { defaultProps: tooltipOverrides },
  },
};
