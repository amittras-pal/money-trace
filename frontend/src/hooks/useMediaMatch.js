import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function useMediaMatch(point) {
  const { breakpoints } = useMantineTheme();
  return useMediaQuery(`(min-width: ${breakpoints[point]})`);
}
