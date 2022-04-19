import ExpenseSummary from "./components/ExpenseSummary";
import LastTwoDays from "./components/LastTwoDays";

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
