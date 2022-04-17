import { Grid, Group } from "@mantine/core";
import BudgetSummary from "./components/BudgetSummary";
import CategoryBlock from "./components/CategoryBlock";
import NewExpense from "./components/NewExpense";
import { useExpenseByCategories } from "../../queries/expense.query";
import LoaderOverlay from "../../components/LoaderOverlay";
import { useState } from "react";
import BudgetBreakdown from "./components/BudgetBreakdown";

function Dashboard() {
  const { data, isLoading } = useExpenseByCategories(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  );

  const [showBreakdown, setShowBreakdown] = useState(false);

  if (isLoading)
    return (
      <Group sx={{ height: "100%" }} direction="column" position="center">
        <LoaderOverlay />
      </Group>
    );

  return (
    <>
      <BudgetSummary
        totalSpent={data?.data?.response?.total}
        onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
        breakdownVisible={showBreakdown}
      />
      {showBreakdown ? (
        <BudgetBreakdown />
      ) : (
        <Grid my={0} mx={-8}>
          {data?.data?.response?.categories.map((o) => (
            <CategoryBlock amount={o.value} name={o.name} key={o.name} />
          ))}
        </Grid>
      )}
      <NewExpense />
    </>
  );
}

export default Dashboard;
