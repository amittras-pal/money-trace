import {
  Box,
  Divider,
  Grid,
  Group,
  Pagination,
  ScrollArea,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import ExpenseListSkeleton from "../../components/ExpenseListSkeleton";
import { APP_TITLE } from "../../constants/app";
import FilterAndSort from "./components/FilterAndSort";
import List from "./components/List";
import { useExpenseList } from "./services";

export default function Expenses() {
  useDocumentTitle(`${APP_TITLE} | Transactions`);
  const [payload, setPayload] = useState({
    filter: {
      startDate: dayjs().startOf("month").toDate(),
      endDate: dayjs().endOf("month").toDate(),
      categories: [],
    },
    paginate: {
      page: 0,
      size: 20,
    },
    sort: {
      date: -1,
    },
  });

  const ref = useRef();
  const { isLoading, data } = useExpenseList(payload, {
    refetchOnWondowFocus: false,
  });

  return (
    <>
      <Group
        spacing={0}
        sx={{ flexDirection: "column", height: "100%" }}
        position="left"
        align="flex-start"
      >
        <FilterAndSort
          filter={payload.filter}
          sort={payload.sort}
          setPayload={setPayload}
        />
        <Pagination
          spacing={4}
          mt="xs"
          size="sm"
          total={data?.data?.response?.meta?.totalPages ?? 10}
          page={payload.paginate.page}
          onChange={(e) =>
            setPayload((s) => ({ ...s, paginate: { size: 20, page: e - 1 } }))
          }
        />
        <Divider my="sm" sx={{ width: "100%" }} />
        <Box sx={{ flexGrow: 1, width: "100%" }} ref={ref}>
          <ScrollArea
            h={ref.current?.clientHeight ?? 0}
            w={ref.current?.clientWidth ?? 0}
            scrollbarSize={6}
          >
            <Grid gutter={8} mx={0}>
              {isLoading ? (
                <ExpenseListSkeleton />
              ) : (
                <List data={data?.data?.response?.data} />
              )}
            </Grid>
          </ScrollArea>
        </Box>
      </Group>
    </>
  );
}
