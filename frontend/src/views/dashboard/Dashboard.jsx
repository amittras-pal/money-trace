import {
  ActionIcon,
  Box,
  createStyles,
  Drawer,
  SimpleGrid,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronUp } from "@tabler/icons";
import React, { useState } from "react";
import { useLast2DaysExpenses } from "../../services/expense.service";
import Last2DaysList from "./Last2DaysList";
import Summary from "./Summary";

function Dashboard() {
  const { breakpoints } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
  const { classes } = useDashboardStyles({ isMobile });

  const [openList, setOpenList] = useState(false);

  const { data: last2Days, isLoading } = useLast2DaysExpenses();

  return (
    <>
      <SimpleGrid cols={isMobile ? 1 : 2}>
        <Box className={classes.chartWrapper}>
          <Summary />
        </Box>
        {isMobile ? (
          <Box className={classes.miniTile}>
            <Text weight={500}>
              Last 2 Day's Expenses ({last2Days?.data?.response?.length})
            </Text>
            {last2Days?.data?.response?.length > 0 && (
              <ActionIcon
                size="lg"
                variant="light"
                color="dark"
                radius="xl"
                onClick={() => setOpenList(true)}>
                <IconChevronUp size={20} />
              </ActionIcon>
            )}
          </Box>
        ) : (
          <Box className={classes.tile}>
            <Last2DaysList
              data={last2Days?.data?.response}
              loading={isLoading}
            />
          </Box>
        )}
      </SimpleGrid>
      {isMobile && (
        <Drawer
          opened={openList}
          onClose={() => setOpenList(false)}
          withCloseButton
          padding="md"
          title={`Last 2 Day's Expenses (${last2Days?.data?.response?.length})`}
          position="bottom"
          size="xl">
          <Last2DaysList
            data={last2Days?.data?.response}
            loading={isLoading}
            inDrawer
          />
        </Drawer>
      )}
    </>
  );
}

const useDashboardStyles = createStyles((theme, { isMobile }) => {
  return {
    chartWrapper: {
      padding: theme.spacing.md,
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[7],
      border: `1px solid ${theme.colors.dark[5]}`,
      display: "flex",
      flexDirection: "column",
      height: isMobile ? "calc(100vh - 210px)" : "calc(100vh - 122px)",
    },
    tile: {
      padding: theme.spacing.md,
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[7],
      border: `1px solid ${theme.colors.dark[5]}`,
      height: isMobile ? "calc(100vh - 210px)" : "calc(100vh - 122px)",
    },
    miniTile: {
      padding: theme.spacing.md,
      boxShadow: theme.shadows.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.dark[7],
      border: `1px solid ${theme.colors.dark[5]}`,
      height: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };
});

export default Dashboard;
