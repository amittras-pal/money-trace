import {
  ActionIcon,
  Box,
  Group,
  Image,
  Pagination,
  ScrollArea,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMemo } from "react";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import {
  ArrowsSort,
  SortAscending2,
  SortDescending2,
} from "tabler-icons-react";
import emptyState from "../../resources/illustrations/Clipboard.svg";
import DefaultColumnFilter from "./DefaultColumnFilter";

function DataTable({
  data = [],
  columns = [],
  tableHeight = "",
  sortBy = [],
  filters = [],
}) {
  const { colors, shadows, radius, colorScheme } = useMantineTheme();
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    rows,
    page,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: 0,
        pageSize: 20,
        sortBy,
        filters,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const pageReport = useMemo(() => {
    const start = pageIndex * pageSize + 1;
    let end = 0;
    if (rows.length <= pageSize) end = rows.length;
    else if (rows.length > pageSize) {
      if (pageSize * (pageIndex + 1) >= rows.length) end = rows.length;
      else end = pageSize * (pageIndex + 1);
    }
    return { start, end };
  }, [pageIndex, pageSize, rows.length]);

  return (
    <>
      <Box
        p={12}
        sx={{
          backgroundColor: colors.gray[9],
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
          <ScrollArea
            style={{ height: tableHeight }}
            scrollbarSize={6}
            type="scroll">
            <Table verticalSpacing="sm" highlightOnHover {...getTableProps()}>
              <Box component="thead">
                {headerGroups.map((hGroup, index) => (
                  <Box
                    component="tr"
                    {...hGroup.getHeaderGroupProps()}
                    key={index}>
                    {hGroup.headers.map((col) => {
                      return (
                        <Box
                          component="th"
                          sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            backgroundColor: colors.gray[9],
                            boxShadow: shadows.sm,
                            cursor: "pointer",
                          }}
                          {...col.getHeaderProps({
                            style: {
                              minWidth: col.minWidth,
                              maxWidth: col.maxWidth,
                              width: col.width,
                            },
                          })}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Text
                              color={
                                colors.gray[colorScheme === "light" ? 7 : 5]
                              }
                              size="sm"
                              mr="auto">
                              {col.render("Header")}
                            </Text>
                            {col.canFilter ? col.render("Filter") : null}
                            {col.canSort && (
                              <ActionIcon
                                radius="xl"
                                {...col.getHeaderProps(
                                  col.getSortByToggleProps()
                                )}>
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
                                ) : (
                                  <ArrowsSort
                                    size={20}
                                    color={colors.gray[5]}
                                  />
                                )}
                              </ActionIcon>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps({
                            style: { ...cell.column.style },
                          })}>
                          {cell.render("Cell")}
                        </td>
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
                {pageReport.start}
              </Text>{" "}
              to{" "}
              <Text component="span" size="xs" weight={500}>
                {pageReport.end}
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
