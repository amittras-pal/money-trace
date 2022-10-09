import {
  Box,
  Divider,
  SegmentedControl,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import ListView from "./components/ListView";
import SummaryView from "./components/SummaryView";

export default function PlanDetails() {
  //TODO: Add data and logic here.
  //TODO: Add Empty State.

  const [view, setView] = useState("list");

  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ width: "100%" }}>
          <Text size="lg" weight={500}>
            A coincidental encounter with an artist
          </Text>
          <Text color={"dimmed"} size="sm">
            A coincidental encounter with an artist in a cafeteria on a
            not-so-busy afternoon. and some more text to go to line 3 and more
            and more d more and mored more and mored more and more
          </Text>
          <Divider
            mt="xs"
            mb={isMobile ? "xs" : "md"}
            color="gray"
            variant="dashed"
          />
        </Box>
      </Box>
      {isMobile ? (
        <>
          <SegmentedControl
            size="sm"
            mb="xs"
            color="indigo"
            value={view}
            onChange={setView}
            data={[
              { label: "Summary", value: "summary" },
              { label: "List", value: "list" },
            ]}
          />
          <SimpleGrid cols={1} sx={{ flexGrow: 1 }}>
            {view === "summary" && <SummaryView />}
            {view === "list" && <ListView />}
          </SimpleGrid>
        </>
      ) : (
        <SimpleGrid cols={2} sx={{ flexGrow: 1 }}>
          <SummaryView />
          <ListView />
        </SimpleGrid>
      )}
    </Box>
  );
}
