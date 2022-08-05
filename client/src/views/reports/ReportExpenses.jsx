import {
  Badge,
  Box,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ExpensesList from "../../components/expensesList/ExpensesList";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useReportDetails } from "../../queries/report.query";
import emptyState from "../../resources/illustrations/Clipboard.svg";
import { currencyFormat } from "../../utils/formatter.utils";
import ReportSummary from "./ReportSummary";

function ReportExpenses() {
  const { id } = useParams();
  const { onError } = useErrorHandler();
  const { isLoading, data: reportDetails } = useReportDetails(id, { onError });

  const [view, setView] = useState("summary");

  if (isLoading)
    return (
      <Group
        position="center"
        sx={(theme) => ({
          height: "500px",
        })}>
        <LoadingOverlay />
      </Group>
    );

  return (
    <>
      <Box>
        <Group position="apart" align="flex-start" noWrap>
          <Box>
            <Text size="lg" weight={500} color="indigo">
              {isLoading
                ? "Loading..."
                : reportDetails?.data?.response?.report.name}
            </Text>
            <Text size="sm" color="dimmed">
              {reportDetails?.data?.response?.report.description}
            </Text>
            <Text size="lg" weight={500} color="gray">
              {currencyFormat.format(reportDetails?.data?.response?.total)}
            </Text>
          </Box>
          <Badge
            sx={{ flexShrink: 0 }}
            mt={6}
            size="lg"
            color={
              reportDetails?.data?.response?.report.open ? "indigo" : "red"
            }>
            {reportDetails?.data?.response?.report.open ? "open" : "closed"}
          </Badge>
        </Group>
        <Divider variant="dashed" color="indigo" my="sm" />
        {reportDetails?.data?.response?.total > 0 ? (
          <>
            <SegmentedControl
              fullWidth
              mb="sm"
              value={view}
              onChange={setView}
              data={[
                { label: "Summary", value: "summary" },
                { label: "List", value: "list" },
              ]}
            />
            {view === "summary" ? (
              <ReportSummary
                summary={reportDetails?.data?.response?.summary}
                total={reportDetails?.data?.response?.total}
              />
            ) : (
              <ExpensesList
                expenseList={reportDetails?.data?.response?.expenses || []}
                height={"calc(100vh - 246px)"}
                relatedQueries={[["report-details", id]]}
                disableExpenseActions={
                  !reportDetails?.data?.response?.report.open
                }
              />
            )}
          </>
        ) : (
          <Group position="center" direction="column" py={24}>
            {/* <ThemeIcon size={200} color="indigo" variant="light" radius="xl">
            <ClipboardOff size={175} />
          </ThemeIcon> */}
            <Image src={emptyState} />
            <Text color="dimmed" align="center">
              No transactions added to this report
            </Text>
          </Group>
        )}
      </Box>
    </>
  );
}

export default ReportExpenses;
