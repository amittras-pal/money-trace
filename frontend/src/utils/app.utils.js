import dayjs from "dayjs";

export function percentage(amount, total) {
  return Math.round((amount / total) * 100);
}

export function severityColor(severityValue) {
  if (severityValue < 50) return "green";
  else if (severityValue >= 50 && severityValue < 75) return "yellow";
  else if (severityValue >= 75 && severityValue < 90) return "orange";
  else return "red";
}

export const getDayString = (dateString) => {
  if (dayjs(dateString).isSame(dayjs(), "date")) return "Today";
  else if (dayjs(dateString).isSame(dayjs().subtract(1, "day"), "date"))
    return "Yesterday";
  else return dayjs(dateString).format("MMM DD, 'YY");
};

export const getMonthsList = (fromDate) => {
  const origin = dayjs(fromDate);
  const current = dayjs();
  const items = [];
  for (let i = 0; i <= current.diff(origin, "month"); i++) {
    const manipulated = origin.add(i, "month");
    items.push({
      label: manipulated.format("MMM, YYYY"),
      value: manipulated.format("YYYY-MM-DD"),
    });
  }
  items.push({
    label: current.format("MMM, YYYY"),
    value: current.format("YYYY-MM-DD"),
  });
  return items.reduce((list, curr) => {
    if (!list.find((d) => d.value === curr.value)) list.push(curr);
    return list;
  }, []);
};
