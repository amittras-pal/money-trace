import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { SortAscending2, SortDescending2 } from "tabler-icons-react";

function DataTable({
  hideActions = false,
  data = [],
  columns = [],
  tableHeight = "",
}) {
  const { colors, shadows } = useMantineTheme();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        hiddenColumns: hideActions ? ["Action"] : [],
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <Group position="apart" mb="md" sx={{ alignItems: "center" }}>
        <Box>
          <Text size="xs" color={colors.gray[7]}>
            <Text component="span" weight={500}>
              {pageIndex * 10 + 1}
            </Text>{" "}
            to{" "}
            <Text component="span" weight={500}>
              {(pageIndex + 1) * 10}
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
      <ScrollArea style={{ height: tableHeight }}>
        <Table
          verticalSpacing="sm"
          highlightOnHover
          {...getTableProps()}
          striped>
          <Box
            component="thead"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: colors.indigo[7],
              boxShadow: shadows.sm,
              cursor: "pointer",
            }}>
            {headerGroups.map((hGroup) => (
              <tr {...hGroup.getHeaderGroupProps()}>
                {hGroup.headers.map((col) => (
                  <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                    <Group position="apart" sx={{ alignItems: "center" }}>
                      <Text color={colors.gray[0]} size="sm">
                        {col.render("Header")}
                      </Text>
                      {col.isSorted ? (
                        col.isSortedDesc ? (
                          <SortDescending2 size={20} color={colors.gray[0]} />
                        ) : (
                          <SortAscending2 size={20} color={colors.gray[0]} />
                        )
                      ) : null}
                    </Group>
                  </th>
                ))}
              </tr>
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
    </>
  );
}

export default DataTable;
