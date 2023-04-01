import dayjs from "dayjs";

export function dateFormatter({ value }) {
  return dayjs(value).format("DD MMM, hh:mm a");
}
