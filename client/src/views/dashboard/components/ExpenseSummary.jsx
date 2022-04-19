import {
  ActionIcon,
  Badge,
  Group,
  RingProgress,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowsDoubleNeSw, Plus } from "tabler-icons-react";
import LoaderOverlay from "../../../components/LoaderOverlay";
import { CATEGORIES, MONTHLY_BUDGET } from "../../../constants/appConstants";
import { useExpenseSummary } from "../../../queries/expense.query";
import { percentage, severityColor } from "../../../utils/app.utils";
import { currencyFormat } from "../../../utils/formatter.utils";

function ExpenseSummary() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 755px)");

  const { data, isLoading } = useExpenseSummary(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  );

  const getCategoryAmount = (categoryName) => {
    return currencyFormat.format(
      data?.data?.response.categories.find((o) => o.name === categoryName)
        ?.value || 0
    );
  };

  const spentPercentage = percentage(
    data?.data?.response.total,
    MONTHLY_BUDGET
  );

  if (isLoading)
    return (
      <Group sx={{ height: "400px" }} direction="column" position="center">
        <LoaderOverlay />
      </Group>
    );

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
        backgroundColor: theme.colors.gray[0],
        boxShadow: theme.shadows.lg,
      }}>
      <Group px={16} pt={16} sx={{ width: "100%" }} spacing={8}>
        <Text size="lg" color="indigo" weight={500}>
          Summary
        </Text>
        <ActionIcon
          ml="auto"
          radius="xl"
          size="lg"
          color="indigo"
          variant="filled">
          <Plus size={20} />
        </ActionIcon>
        <ActionIcon
          radius="xl"
          size="lg"
          color="indigo"
          variant="light"
          component={Link}
          to="/transactions">
          <ArrowsDoubleNeSw size={20} />
        </ActionIcon>
      </Group>
      <RingProgress
        size={225}
        thickness={16}
        label={
          <>
            <Text
              size="xl"
              weight={700}
              align="center"
              color={spentPercentage >= 100 ? "red" : theme.colors.gray[7]}>
              {currencyFormat.format(data?.data?.response.total)}
            </Text>
            <Group spacing={4} position="center" sx={{ alignItems: "center" }}>
              {spentPercentage >= 95 && (
                <ThemeIcon color="red" variant="light" size={30}>
                  <AlertTriangle size={28} />
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
            <Text
              size="sm"
              align="center"
              color={theme.colors.gray[5]}
              weight={500}>
              {currencyFormat.format(MONTHLY_BUDGET)}
            </Text>
          </>
        }
        sections={data?.data?.response?.categories.map((item) => ({
          value: percentage(
            item.value,
            spentPercentage >= 100 ? data?.data?.response.total : MONTHLY_BUDGET
          ),
          color: theme.colors[CATEGORIES[item.name].color][5],
        }))}
      />
      <Group
        direction="row"
        spacing="sm"
        position={isMobile ? "center" : "center"}>
        {Object.entries(CATEGORIES).map(([name]) => (
          <Badge color={CATEGORIES[name].color} variant="light">
            {name}: {getCategoryAmount(name)}
          </Badge>
        ))}
      </Group>
    </Group>
  );
}

export default ExpenseSummary;
