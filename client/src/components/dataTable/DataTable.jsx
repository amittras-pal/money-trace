import {
  Box,
  Group,
  Image,
  Pagination,
  ScrollArea,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { usePagination, useSortBy, useTable } from "react-table";
import { SortAscending2, SortDescending2 } from "tabler-icons-react";
import emptyState from "../../resources/illustrations/Clipboard.svg";

function DataTable({ data = [], columns = [], tableHeight = "", sortBy = [] }) {
  const { colors, shadows, radius, colorScheme } = useMantineTheme();
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
      <Box
        p={12}
        sx={{
          backgroundColor: colors.gray[colorScheme === "light" ? 0 : 8],
          borderRadius: radius.md,
          boxShadow: shadows.md,
        }}>
        {data.length === 0 ? (
          <Group position="center" direction="column" py={24}>
            <Image src={emptyState} />
            <Text color="dimmed" align="center">
              No Records found for the selected month.
            </Text>
          </Group>
        ) : (
          <ScrollArea style={{ height: tableHeight }}>
            <Table verticalSpacing="sm" highlightOnHover {...getTableProps()}>
              <Box component="thead">
                {headerGroups.map((hGroup) => (
                  <Box component="tr" {...hGroup.getHeaderGroupProps()}>
                    {hGroup.headers.map((col) => (
                      <Box
                        component="th"
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                          backgroundColor:
                            colors.gray[colorScheme === "light" ? 0 : 8],
                          boxShadow: shadows.sm,
                          cursor: "pointer",
                        }}
                        {...col.getHeaderProps(col.getSortByToggleProps())}>
                        <Group position="apart" sx={{ alignItems: "center" }}>
                          <Text
                            color={colors.gray[colorScheme === "light" ? 7 : 5]}
                            size="sm">
                            {col.render("Header")}
                          </Text>
                          {col.isSorted ? (
                            col.isSortedDesc ? (
                              <SortDescending2
                                size={20}
                                color={colors.gray[5]}
                              />
                            ) : (
                              <SortAscending2
                                size={20}
                                color={colors.gray[5]}
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
      {data.length > 0 && (
        <Group position="apart" mt={12} sx={{ alignItems: "center" }}>
          <Box>
            <Text
              size="xs"
              color={colors.gray[colorScheme === "light" ? 7 : 5]}>
              <Text component="span" size="xs" weight={500}>
                {pageIndex * pageSize + 1}
              </Text>{" "}
              to{" "}
              <Text component="span" size="xs" weight={500}>
                {(pageIndex + 1) * pageSize > data.length
                  ? data.length
                  : (pageIndex + 1) * pageSize}
              </Text>{" "}
              of{" "}
              <Text component="span" size="xs" weight={500}>
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
    </>
  );
}

export default DataTable;
