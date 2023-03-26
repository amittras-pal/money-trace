import { useMediaQuery } from "@mantine/hooks";

export function useMediaMatch() {
  return useMediaQuery(`(max-width: 576px)`);
}
