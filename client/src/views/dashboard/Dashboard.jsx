import ExpenseSummary from "./components/ExpenseSummary";
import LastTwoDays from "./components/latestExpenses/LastTwoDays";

function Dashboard() {
  // const theme = useMantineTheme();
  return (
    <>
      <ExpenseSummary />
      <LastTwoDays />
    </>
  );
}

export default Dashboard;
