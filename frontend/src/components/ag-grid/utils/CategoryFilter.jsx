import { Box, Button, Checkbox, Group, Text } from "@mantine/core";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { getChildren, getParents } from "../../../constants/categories";

function CategoryFilter(props, ref) {
  const [categories, setCategories] = useState([]);
  const options = useMemo(() => {
    return getParents().map((parent) => {
      const children = getChildren(parent.value);
      return { ...parent, children };
    });
  }, []);

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        return categories.length
          ? categories.includes(params.data.category)
          : true;
      },

      isFilterActive() {
        return categories.length > 0;
      },

      getModel() {
        return categories;
      },

      setModel(model) {},
    };
  });

  const apply = () => {
    props.filterChangedCallback();
    props.api.hidePopupMenu();
  };

  const clear = () => {
    props.api.destroyFilter("category");
  };

  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.colors.gray[8]}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.md,
        maxWidth: 310,
        width: 240,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.dark[5],
        color: theme.colors.gray[2],
      })}
    >
      <Text fw="bold" mb="sm">
        Filter Categories
      </Text>
      {/* <ScrollArea h={200}> */}
      <Checkbox.Group value={categories} onChange={setCategories}>
        <Group
          spacing="xs"
          sx={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {options.map((cat) => (
            <Checkbox
              key={cat.label}
              label={cat.label}
              value={cat.value}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Group>
      </Checkbox.Group>
      {/* </ScrollArea> */}
      <Group grow mt="sm" sx={{ position: "sticky", bottom: 0 }}>
        <Button size="xs" variant="light" onClick={clear}>
          Clear
        </Button>
        <Button size="xs" onClick={apply} disabled={!categories.length}>
          Apply
        </Button>
      </Group>
    </Box>
  );
}

export default forwardRef(CategoryFilter);
