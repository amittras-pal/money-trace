import { useMantineTheme } from "@mantine/core";
import { useEffect } from "react";

const Themer = () => {
  const { primaryColor, colors } = useMantineTheme();

  useEffect(() => {
    colors[primaryColor].forEach((shade, index) => {
      document
        .querySelector(":root")
        .style.setProperty(`--mantine-color-primary-${index}`, shade);
    });
  }, [primaryColor, colors]);
  return null;
};

export default Themer;
