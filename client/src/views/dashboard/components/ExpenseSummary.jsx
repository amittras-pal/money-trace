import {
  ActionIcon,
  Badge,
  Group,
  Image,
  RingProgress,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowsDoubleNeSw } from "tabler-icons-react";
import LoaderOverlay from "../../../components/LoaderOverlay";
import { CATEGORIES } from "../../../constants/appConstants";
import { BudgetContext } from "../../../context/budget.context";
import { useErrorHandler } from "../../../hooks/errorHandler";
import { useExpenseSummary } from "../../../queries/expense.query";
import { percentage, severityColor } from "../../../utils/app.utils";
import { currencyFormat } from "../../../utils/formatter.utils";
import emptyState from "../../../resources/illustrations/Clipboard.svg";
import dayjs from "dayjs";

function ExpenseSummary() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 755px)");
  const { onError } = useErrorHandler();

  const { data, isLoading } = useExpenseSummary(
    new Date().getMonth() + 1,
    new Date().getFullYear(),
    {
      onError,
    }
  );

  const { budget: defaultBudget } = useContext(BudgetContext);

  const getCategoryAmount = (categoryName) => {
    return currencyFormat.format(
      data?.data?.response.categories.find((o) => o.name === categoryName)
        ?.value || 0
    );
  };

  const spentPercentage = percentage(data?.data?.response.total, defaultBudget);

  if (isLoading)
    return (
      <Group sx={{ height: "400px" }} direction="column" position="center">
        <LoaderOverlay />
      </Group>
    );

  const getChartSections = () => {
    if (defaultBudget)
      return data?.data?.response?.categories.map((item) => ({
        value: percentage(
          item.value,
          spentPercentage >= 100 ? data?.data?.response.total : defaultBudget
        ),
        color: theme.colors[CATEGORIES[item.name].color][5],
      }));
    else return [{ value: 0, color: theme.colors.gray[3] }];
  };

  return (
    <Group
      direction="column"
      spacing={0}
      position="center"
      px={4}
      pb="md"
      pt={4}
      sx={{
        borderRadius: theme.radius.md,
        backgroundColor:
          theme.colorScheme === "light"
            ? theme.colors.gray[0]
            : theme.colors.gray[8],
        boxShadow: theme.shadows.sm,
      }}>
      <Group px={16} pt={16} sx={{ width: "100%" }} spacing={8}>
        <Text size="lg" color="indigo" weight={500}>
          Summary {dayjs().format("MMM, 'YY")}
        </Text>
        <ActionIcon
          ml="auto"
          radius="xl"
          size="lg"
          color="indigo"
          variant="light"
          component={Link}
          to="/transactions">
          <ArrowsDoubleNeSw size={20} />
        </ActionIcon>
      </Group>
      {data?.data?.response.total > 0 ? (
        <>
          <RingProgress
            size={225}
            thickness={16}
            label={
              <>
                <Text
                  size="xl"
                  weight={700}
                  align="center"
                  color={
                    defaultBudget
                      ? spentPercentage >= 100
                        ? "red"
                        : theme.colors.gray[
                            theme.colorScheme === "light" ? 7 : 5
                          ]
                      : theme.colors.gray[theme.colorScheme === "light" ? 7 : 5]
                  }>
                  {currencyFormat.format(data?.data?.response.total)}
                </Text>
                {defaultBudget > 0 && (
                  <Group
                    spacing={4}
                    position="center"
                    sx={{ alignItems: "center" }}>
                    {spentPercentage >= 95 && (
                      <ThemeIcon color="red" variant="light" size={30}>
                        <AlertTriangle size={20} />
                      </ThemeIcon>
                    )}
                    <Text
                      weight={700}
                      align="center"
                      sx={{ fontSize: "1.25rem" }}
                      color={severityColor(spentPercentage)}>
                      {spentPercentage}%
                    </Text>
                  </Group>
                )}
                <Text
                  size="sm"
                  align="center"
                  color={defaultBudget ? theme.colors.gray[5] : "red"}
                  weight={500}>
                  {defaultBudget
                    ? currencyFormat.format(defaultBudget)
                    : "Budget not set."}
                </Text>
              </>
            }
            sections={getChartSections()}
          />
          <Group
            direction="row"
            spacing="sm"
            position={isMobile ? "center" : "center"}>
            {Object.entries(CATEGORIES).map(([name]) => (
              <Badge color={CATEGORIES[name].color} variant="light" key={name}>
                {name}: {getCategoryAmount(name)}
              </Badge>
            ))}
          </Group>
        </>
      ) : (
        <>
          <Group direction="column" spacing={4} align="center" py={24}>
            <Image src={emptyState} />
            <Text color="dimmed" size="sm" align="center">
              No Transactions this month.
            </Text>
          </Group>
        </>
      )}
    </Group>
  );
}

export default ExpenseSummary;
