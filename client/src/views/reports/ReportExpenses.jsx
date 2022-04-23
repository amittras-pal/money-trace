import { Badge, Box, Divider, Group, Image, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import ExpensesList from "../../components/expensesList/ExpensesList";
import LoaderOverlay from "../../components/LoaderOverlay";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useReportDetails } from "../../queries/report.query";
import { currencyFormat } from "../../utils/formatter.utils";
import emptyState from "../../resources/illustrations/Clipboard.svg";

function ReportExpenses() {
  const { id } = useParams();
  const { onError } = useErrorHandler();
  const { isLoading, data: reportDetails } = useReportDetails(id, { onError });

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
            {!isLoading && (
              <>
                <Text size="sm" color="dimmed">
                  {reportDetails?.data?.response?.report.description}
                </Text>
                <Text size="lg" weight={500} color="gray">
                  {currencyFormat.format(
                    reportDetails?.data?.response?.expenses.reduce(
                      (prev, curr) => prev + curr.amount,
                      0
                    )
                  )}
                </Text>
              </>
            )}
          </Box>
          {!isLoading && (
            <Badge
              sx={{ flexShrink: 0 }}
              mt={6}
              size="lg"
              color={
                reportDetails?.data?.response?.report.open ? "indigo" : "red"
              }>
              {reportDetails?.data?.response?.report.open ? "open" : "closed"}
            </Badge>
          )}
        </Group>
        <Divider variant="dashed" color="indigo" my={12} />
        {isLoading ? (
          <Group sx={{ height: "400px" }} direction="column" position="center">
            <LoaderOverlay />
          </Group>
        ) : reportDetails?.data?.response?.expenses?.length > 0 ? (
          <ExpensesList
            expenseList={reportDetails?.data?.response?.expenses || []}
            relatedQueries={[["report-details", id]]}
            disableExpenseActions={!reportDetails?.data?.response?.report.open}
          />
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
