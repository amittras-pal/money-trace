import React from "react";
import ExpenseCard from "../../../components/ExpenseCard";

export default function List({ data }) {
  return data.map((exp) => (
    <ExpenseCard
      key={exp._id}
      data={exp}
      // onEditExpense={onEditExpense}
      // onDeleteExpense={onDeleteExpense}
    />
  ));
}
