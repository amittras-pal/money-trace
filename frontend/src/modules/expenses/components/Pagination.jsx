import React from "react";
import { Pagination as MPagination } from "@mantine/core";

export default function Pagination({ paginate, totalPages, onChange }) {
  return (
    <MPagination total={totalPages} page={paginate.page} onChange={onChange} />
  );
}
