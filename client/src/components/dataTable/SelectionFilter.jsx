import { ActionIcon, Menu, ThemeIcon } from "@mantine/core";
import React, { useMemo } from "react";
import { Filter, X } from "tabler-icons-react";

function SelectionFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => options.add(row.values[id]));
    return [...options.values()].map((option) => ({
      label: option,
      value: option,
    }));
  }, [id, preFilteredRows]);

  return (
    <Menu
      position="bottom"
      placement="center"
      control={
        <ActionIcon
          variant={filterValue ? "light" : "hover"}
          size="md"
          mr={4}
          radius="xl"
          color={filterValue ? "blue" : "gray"}>
          <Filter size={18} />
        </ActionIcon>
      }>
      {options.map((item) => (
        <Menu.Item
          key={item.value}
          rightSection={
            filterValue === item.value ? (
              <ThemeIcon color="red" size="sm" variant="light" radius="xl">
                <X size={12} />
              </ThemeIcon>
            ) : null
          }
          onClick={() => {
            setFilter(filterValue === item.value ? undefined : item.value);
          }}
          color={filterValue === item.value ? "blue" : "gray"}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default SelectionFilter;
