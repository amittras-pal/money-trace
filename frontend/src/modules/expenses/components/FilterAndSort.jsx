import React from "react";
import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Group } from "@mantine/core";
import { useCurrentUser } from "../../../context/user";

export default function FilterAndSort({ filter, sort, setPayload }) {
  const { userData } = useCurrentUser();
  const handleMonthChange = (e) => {
    setPayload((prev) => ({
      ...prev,
      filter: {
        startDate: dayjs(e).startOf("month"),
        endDate: dayjs(e).endOf("month"),
        categories: prev.filter.categories,
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
    <Group sx={{ width: "100%" }}>
      <MonthPickerInput
        placeholder="Pick month"
        dropdownType="modal"
        value={filter.startDate}
        onChange={handleMonthChange}
        maxDate={dayjs().toDate()}
        minDate={
          userData ? dayjs(userData?.createdAt).toDate() : dayjs().toDate()
        }
        variant="filled"
      />
    </Group>
  );
}
