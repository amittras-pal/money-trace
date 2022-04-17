import { Grid, Group } from "@mantine/core";
import { useState } from "react";
import LoaderOverlay from "../../components/LoaderOverlay";
import { CATEGORIES } from "../../constants/appConstants";
import { useExpenseByCategories } from "../../queries/expense.query";
import BudgetBreakdown from "./components/BudgetBreakdown";
import BudgetSummary from "./components/BudgetSummary";
import CategoryBlock from "./components/CategoryBlock";

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
          {Object.keys(CATEGORIES).map((key) => (
            <CategoryBlock
              key={key}
              name={key}
              amount={
                data?.data?.response?.categories?.find((o) => o.name === key)
                  ?.value || 0
              }
            />
          ))}
        </Grid>
      )}
    </>
  );
}

export default Dashboard;
