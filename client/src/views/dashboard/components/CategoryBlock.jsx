import { Divider, Grid, Group, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { CATEGORIES } from "../../../constants/appConstants";
import { currencyFormat } from "../../../utils/formatter.utils";

function CategoryBlock({ amount, name }) {
  const isMobile = useMediaQuery("(max-width: 755px)");
  const { colors } = useMantineTheme();
  const Icon = CATEGORIES[name].icon;
  return (
    <Grid.Col span={isMobile ? 6 : 4} p={8}>
      <Group
        direction="column"
        spacing={0}
        sx={(theme) => ({
          padding: theme.spacing.md,
          width: "100%",
          boxShadow: theme.shadows.sm,
          borderTop: `2px solid ${theme.colors[CATEGORIES[name].color][8]}`,
          borderRadius: theme.radius.md,
          backgroundImage: theme.fn.linearGradient(
            180,
            theme.colors[CATEGORIES[name].color][2],
            theme.colors[CATEGORIES[name].color][0]
          ),
        })}>
        <Group spacing="xs">
          <Icon
            size={isMobile ? 20 : 36}
            color={colors[CATEGORIES[name].color][8]}
          />
          <Text
            weight={500}
            size={isMobile ? "xs" : "lg"}
            color={colors[CATEGORIES[name].color][8]}>
            {name}
          </Text>
        </Group>
        <Divider
          variant="dashed"
          my="xs"
          sx={{ width: "100%" }}
          color={CATEGORIES[name].color}
        />
        <Text weight={700} color={colors.gray[7]}>
          {currencyFormat.format(amount)}
        </Text>
      </Group>
    </Grid.Col>
  );
}

export default CategoryBlock;
