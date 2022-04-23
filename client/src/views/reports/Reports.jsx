import {
  ActionIcon,
  Box,
  Group,
  Image,
  Modal,
  Switch,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import LoaderOverlay from "../../components/LoaderOverlay";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useReports } from "../../queries/report.query";
import ReportCard from "./components/ReportCard";
import ReportForm from "./components/ReportForm";
import noReports from "../../resources/illustrations/NoReports.svg";

function Reports() {
  const [open, setOpen] = useState(false);
  const [allReports, setAllReports] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { onError } = useErrorHandler();
  const { data: reportsList, isLoading } = useReports(allReports, { onError });

  const closeReportForm = () => {
    if (selectedItem) setSelectedItem(null);
    else setOpen(false);
  };

  return (
    <>
      <Switch
        mb={12}
        label="All Reports"
        checked={allReports}
        color="indigo"
        onChange={(event) => setAllReports(event.currentTarget.checked)}
      />
      {isLoading ? (
        <Group sx={{ height: "400px" }} direction="column" position="center">
          <LoaderOverlay />
        </Group>
      ) : (
        <>
          <Box>
            {reportsList?.data?.response?.length > 0 ? (
              reportsList?.data?.response.map((report) => (
                <ReportCard
                  key={report._id}
                  data={report}
                  onEdit={setSelectedItem}
                />
              ))
            ) : (
              <Group direction="column" align="center" mt={64}>
                <Image src={noReports} />
                <Text color="dimmed" size="sm" align="center">
                  You do not have any {allReports ? "" : "open"} reports
                </Text>
              </Group>
            )}
          </Box>
          <ActionIcon
            onClick={() => setOpen(true)}
            size="xl"
            color="indigo"
            variant="filled"
            radius="xl"
            sx={{
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
              zIndex: 1000,
            }}>
            <Plus size={24} />
          </ActionIcon>
          <Modal
            opened={open || selectedItem}
            onClose={closeReportForm}
            withCloseButton={false}>
            <ReportForm
              data={selectedItem}
              onComplete={closeReportForm}
              onCancel={closeReportForm}
            />
          </Modal>
        </>
      )}
    </>
  );
}

export default Reports;
