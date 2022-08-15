import {
  Badge,
  Box,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  SegmentedControl,
  Select,
  Text,
} from "@mantine/core";
import { useMemo, useState } from "react";
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

  const [filter, setFilter] = useState("");

  const filterOptions = useMemo(() => {
    if (isLoading) return [];
    return Object.entries(reportDetails?.data?.response.summary ?? {})?.map(
      ([key]) => ({
        label: key,
        value: key,
      })
    );
  }, [reportDetails?.data?.response, isLoading]);

  console.log(filterOptions);

  const [view, setView] = useState("summary");

  if (isLoading)
    return (
      <Group
        position="center"
        sx={() => ({
          height: "500px",
        })}>
        <LoadingOverlay />
      </Group>
    );

  return (
    <>
      <Group position="apart" align="flex-start" noWrap>
        <Box>
          <Text size="lg" weight={500} color="blue">
            {reportDetails?.data?.response?.report.name}
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
          color={reportDetails?.data?.response?.report.open ? "indigo" : "red"}>
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
            onChange={(e) => {
              setView(e);
              setFilter("");
            }}
            data={[
              { label: "Summary", value: "summary" },
              { label: "List", value: "list" },
            ]}
          />
          {view === "summary" ? (
            <ReportSummary
              summary={reportDetails?.data?.response?.summary}
              total={reportDetails?.data?.response?.total}
              onBadgeClick={(badge) => {
                setFilter(badge);
                setView("list");
              }}
            />
          ) : (
            <>
              <Select
                data={filterOptions}
                value={filter}
                placeholder="Filter Category"
                onChange={setFilter}
                clearable
                mb="sm"
              />
              <ExpensesList
                expenseList={
                  reportDetails?.data?.response?.expenses?.filter((item) =>
                    filter ? item.category === filter : true
                  ) || []
                }
                height={"calc(100vh - 288px)"}
                relatedQueries={[["report-details", id]]}
                disableExpenseActions={
                  !reportDetails?.data?.response?.report.open
                }
              />
            </>
          )}
        </>
      ) : (
        <Group position="center" direction="column" py={24}>
          <Image src={emptyState} />
          <Text color="dimmed" align="center">
            No transactions added to this report
          </Text>
        </Group>
      )}
    </>
  );
}

export default ReportExpenses;
