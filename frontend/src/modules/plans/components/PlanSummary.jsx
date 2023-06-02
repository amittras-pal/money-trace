import { Box, Loader, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { IconListCheck } from "@tabler/icons-react";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { APP_TITLE, primaryColor } from "../../../constants/app";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useSummary } from "../../home/services";
import { usePlanDetails } from "../services";

function PlanSummary() {
  const { onError } = useErrorHandler();
  const params = useParams();

  const { data: detailsRes, isLoading: loadingDetails } = usePlanDetails(
    params.id,
    { onError }
  );
  const { data: summary, isLoading: loadingSummary } = useSummary(params.id, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError,
  });

  useDocumentTitle(`${APP_TITLE} | Plan: ${detailsRes?.data?.response?.name}`);

  const summaryData = useMemo(() => {
    return summary ? Object.entries(summary?.data?.response.summary ?? {}) : [];
  }, [summary]);

  if (loadingSummary || loadingDetails)
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader size={80} />
      </Box>
    );

  return (
    <SimpleGrid
      cols={summaryData.length > 0 ? 2 : 1}
      spacing="xs"
      verticalSpacing="xs"
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[6],
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
      })}
      breakpoints={[
        { maxWidth: "md", cols: 2, spacing: "sm", verticalSpacing: "sm" },
        { maxWidth: "sm", cols: 1, spacing: "sm", verticalSpacing: "sm" },
      ]}
    >
      {summaryData.length === 0 && (
        <Box
          sx={{
            height: "200px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemeIcon size={100} color={primaryColor} radius="xl">
            <IconListCheck size={75} />
          </ThemeIcon>
          <Text fz="lg" color="dimmed" mt="md">
            No Expenses Added
          </Text>
        </Box>
      )}
      {summaryData?.map(([category, data]) => (
        <BudgetItem
          category={category}
          subCategories={data.subCategories}
          total={data.total}
          key={category}
        />
      ))}
    </SimpleGrid>
  );
}

export default PlanSummary;
