import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import {
  ClipboardOff,
  SortAscending2,
  SortDescending2,
} from "tabler-icons-react";

function DataTable({ data = [], columns = [], tableHeight = "", sortBy = [] }) {
  const { colors, shadows, radius } = useMantineTheme();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 20,
        sortBy,
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      {data.length > 0 && (
        <Group position="apart" mb="md" sx={{ alignItems: "center" }}>
          <Box>
            <Text size="xs" color={colors.gray[7]}>
              <Text component="span" weight={500}>
                {pageIndex * pageSize + 1}
              </Text>{" "}
              to{" "}
              <Text component="span" weight={500}>
                {(pageIndex + 1) * pageSize > data.length
                  ? data.length
                  : (pageIndex + 1) * pageSize}
              </Text>{" "}
              of{" "}
              <Text component="span" weight={500}>
                {rows.length}
              </Text>
            </Text>
          </Box>
          <Pagination
            total={pageCount}
            page={pageIndex + 1}
            color="indigo"
            spacing={4}
            size="sm"
            onChange={(v) => gotoPage(v - 1)}
          />
        </Group>
      )}
      <Box
        p={12}
        sx={{ backgroundColor: colors.gray[0], borderRadius: radius.md }}>
        {data.length === 0 ? (
          <Group py={100} position="center" direction="column">
            <ThemeIcon size={200} color="indigo" variant="light" radius="xl">
              <ClipboardOff size={175} />
            </ThemeIcon>
            <Text size="xl" weight={600} color="indigo">
              No Records found.
            </Text>
          </Group>
        ) : (
          <ScrollArea style={{ height: tableHeight }}>
            <Table verticalSpacing="sm" highlightOnHover {...getTableProps()}>
              <Box component="thead">
                {headerGroups.map((hGroup) => (
                  <Box
                    component="tr"
                    // sx={{
                    //   position: "sticky",
                    //   top: 0,
                    //   zIndex: 10,
                    //   backgroundColor: colors.gray[0],
                    //   boxShadow: shadows.sm,
                    //   cursor: "pointer",
                    // }}
                    {...hGroup.getHeaderGroupProps()}>
                    {hGroup.headers.map((col) => (
                      <Box
                        component="th"
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                          backgroundColor: colors.gray[0],
                          boxShadow: shadows.sm,
                          cursor: "pointer",
                        }}
                        {...col.getHeaderProps(col.getSortByToggleProps())}>
                        <Group position="apart" sx={{ alignItems: "center" }}>
                          <Text color={colors.gray[7]} size="sm">
                            {col.render("Header")}
                          </Text>
                          {col.isSorted ? (
                            col.isSortedDesc ? (
                              <SortDescending2
                                size={20}
                                color={colors.gray[6]}
                              />
                            ) : (
                              <SortAscending2
                                size={20}
                                color={colors.gray[6]}
                              />
                            )
                          ) : null}
                        </Group>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <Box
                          component="td"
                          sx={{
                            maxWidth: "300px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </Box>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>
        )}
      </Box>
    </>
  );
}

export default DataTable;
