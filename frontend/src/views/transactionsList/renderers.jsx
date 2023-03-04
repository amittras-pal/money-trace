import { ActionIcon, Badge, Box, Text, Tooltip } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons";
import dayjs from "dayjs";
import { useMemo } from "react";
import ExpenseDescription from "../../components/expenseDescription/ExpenseDescription";
import { CATEGORIES } from "../../constants/app.constants";
import { currencyFormat } from "../../utils/formatter.utils";

export function MenuColumn({ data, onRevert }) {
  const isReportOld = useMemo(() => {
    return dayjs(data.expenseDate).isBefore(dayjs().subtract(2, "day"));
  }, [data.expenseDate]);
  return isReportOld && !data.reverted ? (
    <Tooltip position="left" label="Revert Expense" color="red" withArrow>
      <ActionIcon
        variant="transparent"
        color="red"
        radius="xl"
        size="sm"
        onClick={() => onRevert(data)}
      >
        <IconArrowBackUp size={16} />
      </ActionIcon>
    </Tooltip>
  ) : null;
}

export function AmountColumnHeader({ appliedFilter, data = [] }) {
  const total = appliedFilter.value
    ? `(${currencyFormat.format(
        data.reduce((value, curr) => (value += curr.amount), 0)
      )})`
    : "";
  return "Amount " + total;
}

export function AmountColumn({ data, value }) {
  return (
    <Text
      color={data.reverted ? "dimmed" : "red"}
      weight={500}
      strikethrough={data.reverted}
    >
      {currencyFormat.format(value)}
    </Text>
  );
}

export function CategoryColumn({ value }) {
  return (
    <Badge size="sm" color={CATEGORIES[value].color}>
      {value}
    </Badge>
  );
}

export function TitleColumn({ data }) {
  return (
    <Box m={4}>
      <Text
        strikethrough={data.reverted}
        color={data.reverted ? "dimmed" : "#F1F3F5"}
        sx={{ width: "100%", whiteSpace: "break-spaces" }}
        my={0}
        lineClamp={2}
      >
        {data.title}
      </Text>
      <ExpenseDescription
        color="dimmed"
        my={0}
        size="xs"
        sx={{ width: "100%", whiteSpace: "break-spaces" }}
      >
        {data.description}
      </ExpenseDescription>
    </Box>
  );
}
