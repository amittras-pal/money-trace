import dayjs from "dayjs";

export function downloadFile(dataBlob, fileName) {
  const href = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

export function dateStr(date) {
  return dayjs(date).format("DD_MMMM_YYYY");
}
