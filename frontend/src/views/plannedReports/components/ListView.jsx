import { Box, ScrollArea, Select, Text, useMantineTheme } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

export default function ListView() {
  const ref = useRef();
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const { spacing } = useMantineTheme();

  useEffect(() => {
    const tileContainer = ref.current;
    if (tileContainer) {
      const tileHeight = tileContainer.getBoundingClientRect().height.toFixed();
      const paddingCompensation = spacing.sm * 2 + 4;
      const selectCompensation = 42;
      console.log(`${tileHeight - paddingCompensation - selectCompensation}px`);
      setScrollAreaHeight(
        `${tileHeight - paddingCompensation - selectCompensation}px`
      );
    }
  }, [spacing.sm]);

  return (
    <Box
      ref={ref}
      sx={(theme) => ({
        padding: theme.spacing.sm,
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.dark[7],
        border: `1px solid ${theme.colors.dark[5]}`,
      })}>
      <Select
        size="xs"
        mb="sm"
        maxDropdownHeight={200}
        placeholder="Filter by category"
        data={[
          {
            label: "Some Label 1",
            value: "Some Value 1",
          },
          {
            label: "Some Label 2",
            value: "Some Value 2",
          },
          {
            label: "Some Label 3",
            value: "Some Value 3",
          },
        ]}
      />
      <ScrollArea style={{ height: scrollAreaHeight }}>
        {/* ADD Expense List here. */}
      </ScrollArea>
    </Box>
  );
}
