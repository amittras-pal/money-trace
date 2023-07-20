import {
  Box,
  Divider,
  Loader,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { primaryColor } from "../../../constants/app";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useSummary } from "../../home/services";
import { formatCurrency } from "../../../utils";

function PlanSummary() {
  const { onError } = useErrorHandler();
  const params = useParams();

  const { data: summary, isLoading: loadingSummary } = useSummary(params.id, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError,
  });

  const summaryData = useMemo(() => {
    return summary ? Object.entries(summary?.data?.response.summary ?? {}) : [];
  }, [summary]);

  if (loadingSummary)
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
    <Box
      sx={(theme) => ({
        height: "100%",
        backgroundColor: theme.colors.dark[6],
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
      })}
    >
      <ScrollArea w="100%" h="calc(100% - 50px)">
        <SimpleGrid
          cols={summaryData.length > 0 ? 2 : 1}
          spacing="xs"
          verticalSpacing="xs"
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
      </ScrollArea>
      <Divider my={8} />
      <Text fw="bold" fz="lg" px={4}>
        Total: {formatCurrency(summary?.data?.response?.total)}
      </Text>
    </Box>
  );
}

export default PlanSummary;
