import {
  Box,
  Divider,
  Group,
  Image,
  SegmentedControl,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CenteredLoader from "../../components/centeredLoader/CenteredLoader";
import { useErrorHandler } from "../../hooks/errorHandler";
import emptyState from "../../resources/Clipboard.svg";
import { useReportDetails } from "../../services/report.service";
import ListView from "./components/ListView";
import SummaryView from "./components/SummaryView";

export default function PlanDetails() {
  //TODO: Add Actions to close or delete this expense plan here.

  const { id } = useParams();
  const { onError } = useErrorHandler();
  const { isLoading, data: reportDetails } = useReportDetails(id, { onError });

  const [view, setView] = useState("summary");

  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  if (isLoading) return <CenteredLoader />;

  return (
    <>
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
              {reportDetails?.data.response.report.name}
            </Text>
            <Text color={"dimmed"} size="sm">
              {reportDetails?.data.response.report.description}
            </Text>
            <Divider
              mt="xs"
              mb={isMobile ? "xs" : "md"}
              color="gray"
              variant="dashed"
            />
          </Box>
        </Box>
        {reportDetails?.data?.response?.expenses?.length > 0 ? (
          <>
            {isMobile ? (
              // Mobile View
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
                  {view === "summary" && (
                    <SummaryView data={reportDetails?.data?.response} />
                  )}
                  {view === "list" && (
                    <ListView data={reportDetails?.data?.response} />
                  )}
                </SimpleGrid>
              </>
            ) : (
              // PC View
              <SimpleGrid cols={2} sx={{ flexGrow: 1 }}>
                <SummaryView data={reportDetails?.data?.response} />
                <ListView data={reportDetails?.data?.response} />
              </SimpleGrid>
            )}
          </>
        ) : (
          <Group
            position="center"
            align="center"
            sx={{ flexDirection: "column" }}
            py={24}>
            <Image src={emptyState} width={isMobile ? 240 : 480} />
            <Text color="dimmed" align="center" size="sm">
              No transactions have been added to this report yet. Add from the
              dashboard.
            </Text>
          </Group>
        )}
      </Box>
    </>
  );
}
