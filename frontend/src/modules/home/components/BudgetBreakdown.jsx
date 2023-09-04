import {
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Progress,
  ScrollArea,
  SimpleGrid,
  Switch,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCash,
  IconChevronUp,
  IconExclamationMark,
  IconPlus,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BudgetItem from "../../../components/BudgetItem";
import { useCurrentUser } from "../../../context/user";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useMediaMatch } from "../../../hooks/useMediaMatch";
import {
  formatCurrency,
  getPercentage,
  getSeverityColor,
} from "../../../utils";
import { useSummary } from "../services";
import { useStyles } from "../styles";
import { useHotkeys } from "@mantine/hooks";

export default function BudgetBreakdown({ showForm, showRecent, recents }) {
  const [showSelection, setShowSelection] = useState(false);
  const [selection, setSelection] = useState([]);
  const { budget, userData } = useCurrentUser();
  const { onError } = useErrorHandler();
  const isMobile = useMediaMatch();
  const { classes } = useStyles();
  const selectionToggle = useRef();

  useHotkeys([
    ["n", showForm],
    [
      "shift+s",
      () => {
        setShowSelection((v) => !v);
        selectionToggle.current.focus();
      },
    ],
  ]);

  const {
    data: summary,
    refetch,
    isLoading,
  } = useSummary(null, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError,
  });

  const ref = useRef();
  useEffect(() => {
    if (userData) refetch();
  }, [refetch, userData]);

  const handleSelection = ({ currentTarget }) => {
    if (currentTarget.checked) setSelection((v) => [...v, currentTarget.value]);
    else setSelection((v) => v.filter((o) => o !== currentTarget.value));
  };

  const { percColor, percSpent } = useMemo(
    () => ({
      percSpent: getPercentage(summary?.data?.response.total, budget),
      percColor: getSeverityColor(summary?.data?.response.total, budget),
    }),
    [budget, summary?.data?.response.total]
  );

  const selectionTotal = useMemo(() => {
    return Object.entries(summary?.data?.response?.summary ?? []).reduce(
      (sum, [key, data]) => (selection.includes(key) ? sum + data.total : sum),
      0
    );
  }, [selection, summary?.data?.response]);

  if (!budget)
    return (
      <Box className={classes.noInfo}>
        <Text>Budget Info not Available.</Text>
      </Box>
    );

  if (isLoading)
    return (
      <Box className={classes.noInfo}>
        <Loader size={50} />
      </Box>
    );

  return (
    <Box ref={ref} className={classes.budgetWrapper}>
      <Group position="apart">
        <Text fw="bold" mr="auto">
          {dayjs().format("MMM, 'YY")}
        </Text>
        {Object.entries(summary?.data?.response.summary ?? {})?.length > 1 && (
          <Switch
            labelPosition="left"
            label={showSelection ? formatCurrency(selectionTotal) : "Select"}
            size="sm"
            ref={selectionToggle}
            checked={showSelection}
            onChange={(e) => {
              setShowSelection(e.currentTarget.checked);
            }}
          />
        )}
        {summary?.data?.response?.total > budget && (
          <Tooltip
            label={
              <Text component="span" fw="normal" size="sm">
                Budget Exceeded
              </Text>
            }
            color="dark"
            position="bottom"
            events={{ touch: true }}
          >
            <ThemeIcon radius="lg" size="sm" color="red">
              <IconExclamationMark size={14} />
            </ThemeIcon>
          </Tooltip>
        )}
      </Group>
      <Divider my="xs" />
      <ScrollArea h={`calc(100vh - ${isMobile ? 272 : 242}px)`}>
        <SimpleGrid cols={1} spacing="xs">
          {Object.entries(summary?.data?.response.summary ?? {})?.map(
            ([category, data]) => (
              <BudgetItem
                category={category}
                subCategories={data.subCategories}
                total={data.total}
                key={category}
                showSelection={showSelection}
                selection={selection}
                onSelectionChange={handleSelection}
              />
            )
          )}
        </SimpleGrid>
      </ScrollArea>
      <Group grow spacing="xs" align="flex-start" mt="auto">
        <Group
          sx={{
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
          h="100%"
          spacing={4}
        >
          <Group position="apart" w="100%">
            <Text fz="sm" fw="bold" color={percColor}>
              {percSpent}%
            </Text>
            <Text size="sm" fw="normal">
              of {formatCurrency(budget)}
            </Text>
          </Group>
          <Progress size="xs" value={percSpent} color={percColor} w="100%" />
          <Text fz="sm">
            <IconArrowUpRight size={16} style={{ marginBottom: -3 }} />{" "}
            {formatCurrency(summary?.data?.response?.total)}
          </Text>
          <Text fz="sm">
            <IconCash size={16} style={{ marginBottom: -3 }} />{" "}
            {formatCurrency(budget - summary?.data?.response?.total)}
          </Text>
        </Group>
        <Group
          sx={{
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
          }}
          spacing="xs"
          align="flex-end"
        >
          <Button
            ml="auto"
            leftIcon={<IconPlus size={18} />}
            size="xs"
            onClick={showForm}
            autoFocus
          >
            Add New
          </Button>
          {isMobile && recents && (
            <Button
              size="xs"
              variant="light"
              onClick={showRecent}
              rightIcon={<IconChevronUp size={18} />}
            >
              View Recent ({recents})
            </Button>
          )}
          <Button
            size="xs"
            variant="light"
            rightIcon={<IconArrowRight size={18} />}
            component={Link}
            to="/expenses"
          >
            View All
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
