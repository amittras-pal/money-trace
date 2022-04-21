import { ActionIcon, Box, Group, Modal, Switch } from "@mantine/core";
import { useState } from "react";
import { Plus } from "tabler-icons-react";
import LoaderOverlay from "../../components/LoaderOverlay";
import { useReports } from "../../queries/report.query";
import ReportCard from "./components/ReportCard";
import ReportForm from "./components/ReportForm";

function Reports() {
  const [open, setOpen] = useState(false);
  const [allReports, setAllReports] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: reportsList, isLoading } = useReports(allReports);

  const closeReportForm = () => {
    if (selectedItem) setSelectedItem(null);
    else setOpen(false);
  };

  return (
    <>
      {/* {!getSavedBudget() && <BudgetMonitor />} */}
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
            {reportsList?.data?.response.map((report) => (
              <ReportCard
                key={report._id}
                data={report}
                onEdit={setSelectedItem}
              />
            ))}
          </Box>
          <ActionIcon
            onClick={() => setOpen(true)}
            size="xl"
            color="indigo"
            variant="filled"
            radius="xl"
            sx={(theme) => ({
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            })}>
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
