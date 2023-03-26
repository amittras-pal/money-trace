import { Box, Button, Modal, MultiSelect } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { getParents } from "../../../constants/categories";
import { useCurrentUser } from "../../../context/user";

export default function FilterAndSort({ filter, sort, setPayload }) {
  const { userData } = useCurrentUser();
  const [show, modal] = useDisclosure(false);

  const [month, setMonth] = useState(filter.startDate);
  const [categories, setCategories] = useState(filter.categories);

  const applyFilters = () => {
    modal.close();
    setPayload((prev) => ({
      ...prev,
      filter: {
        startDate: dayjs(month).startOf("month"),
        endDate: dayjs(month).endOf("month"),
        categories: categories,
      },
      paginate: {
        page: 0,
        size: 20,
      },
      sort: {
        date: -1,
      },
    }));
  };

  return (
    <>
      <Button variant="default" size="xs" onClick={modal.open}>
        <IconFilter size={18} />
      </Button>
      <Modal opened={show} centered title="Filter & Sort" onClose={modal.close}>
        <MonthPickerInput
          mb="md"
          label="Select Month"
          placeholder="Select month"
          variant="filled"
          value={month}
          onChange={setMonth}
          maxDate={dayjs().toDate()}
          minDate={
            userData ? dayjs(userData?.createdAt).toDate() : dayjs().toDate()
          }
        />
        <MultiSelect
          dropdownPosition="bottom"
          mb="md"
          label="Filter Categories"
          placeholder="Filter Categories"
          data={getParents()}
          value={categories}
          onChange={setCategories}
        />
        <Button fullWidth mt="xl" variant="light" onClick={applyFilters}>
          Apply
        </Button>
        <Box sx={{ height: "300px" }}></Box>
      </Modal>
    </>
  );
}
