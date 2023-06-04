import {
  Box,
  Button,
  Checkbox,
  createStyles,
  Group,
  Loader,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useCategories } from "../../../services/categories";

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: `1px solid ${theme.colors.gray[8]}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.md,
    maxWidth: 310,
    width: 240,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.dark[5],
    color: theme.colors.gray[2],
  },
  selectionGroup: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
}));

function Category(props, ref) {
  const { classes } = useStyles();
  const [selection, setSelection] = useState([]);

  const { isLoading, data: catRes } = useCategories();

  const categoryOptions = useMemo(() => {
    const s = new Set();
    const avCats = new Set();
    props.api.forEachNode((node) => {
      avCats.add(node.data.category.group);
    });
    catRes?.data?.response?.forEach((cat) => {
      if (avCats.has(cat.group)) s.add(cat.group);
    });
    return Array.from(s);
  }, [catRes?.data?.response, props.api]);

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        return selection.length
          ? selection.includes(params.data.category.group)
          : true;
      },

      isFilterActive() {
        return selection.length > 0;
      },

      getModel() {
        return selection;
      },

      setModel(model) {},
    };
  });

  const cleanup = () => {
    props.api.destroyFilter("category._id");
    props.api.hidePopupMenu();
  };

  const apply = () => {
    props.filterChangedCallback();
    cleanup();
  };

  const clear = () => {
    props.api.destroyFilter("category.group");
    cleanup();
  };

  return (
    <Box className={classes.wrapper}>
      <Text fw="bold" mb="sm">
        Filter Categories
      </Text>
      <Checkbox.Group value={selection} onChange={setSelection}>
        <Group spacing="xs" className={classes.selectionGroup}>
          {isLoading ? (
            <Loader size={32} />
          ) : (
            categoryOptions.map((opt) => (
              <Checkbox
                key={opt}
                label={opt}
                value={opt}
                sx={{ cursor: "pointer" }}
              />
            ))
          )}
        </Group>
      </Checkbox.Group>
      <Group grow mt="sm" sx={{ position: "sticky", bottom: 0 }}>
        <Button
          size="xs"
          variant="light"
          onClick={clear}
          disabled={!selection.length}
        >
          Clear
        </Button>
        <Button size="xs" onClick={apply} disabled={!selection.length}>
          Apply
        </Button>
      </Group>
    </Box>
  );
}

function SubCategory(props, ref) {
  const [selection, setSelection] = useState([]);
  const { classes } = useStyles();

  const { isLoading, data: catRes } = useCategories();

  const categoryOptions = useMemo(() => {
    const instance = props.api.getFilterInstance("category.group");
    if (!instance || !instance?.isFilterActive()) return [];

    const selectedGroups = instance?.getModel();
    const avCats = new Set();
    props.api.forEachNode((node) => {
      avCats.add(node.data.category._id);
    });
    const filtered = catRes?.data?.response.filter(
      (cat) => selectedGroups.includes(cat.group) && avCats.has(cat._id)
    );
    return filtered.reduce((grouping, current) => {
      const groupIndex = grouping.findIndex((g) => g.label === current.group);
      if (groupIndex > -1) grouping[groupIndex].children.push(current);
      else grouping.push({ label: current.group, children: [current] });

      return grouping;
    }, []);
  }, [catRes?.data?.response, props.api]);

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        return selection.length
          ? selection.includes(params.data.category._id)
          : true;
      },

      isFilterActive() {
        return selection.length > 0;
      },

      getModel() {
        return selection;
      },

      setModel(model) {},
    };
  });

  const apply = () => {
    props.filterChangedCallback();
    props.api.hidePopupMenu();
  };

  const clear = () => {
    props.api.destroyFilter("category._id");
    props.api.hidePopupMenu();
  };

  return (
    <Box className={classes.wrapper}>
      <Text fw="bold" mb="sm">
        Filter Sub Categories
      </Text>
      <ScrollArea h={categoryOptions.length > 0 ? 200 : 75}>
        {categoryOptions.length > 0 ? (
          <Checkbox.Group value={selection} onChange={setSelection}>
            <Group spacing="xs" className={classes.selectionGroup}>
              {isLoading ? (
                <Loader size={32} />
              ) : (
                categoryOptions.map((opt) => (
                  <Fragment key={opt.label}>
                    <Text fz="xs">{opt.label}</Text>
                    {opt.children.map((child) => (
                      <Checkbox
                        key={child._id}
                        label={child.label}
                        value={child._id}
                        sx={{ cursor: "pointer" }}
                      />
                    ))}
                  </Fragment>
                ))
              )}
            </Group>
          </Checkbox.Group>
        ) : (
          <Text ta="center" color="dimmed">
            Please select one or more categories first to filter by
            subcategories.
          </Text>
        )}
      </ScrollArea>
      {categoryOptions.length > 0 && (
        <Group grow mt="sm" sx={{ position: "sticky", bottom: 0 }}>
          <Button
            size="xs"
            variant="light"
            onClick={clear}
            disabled={!selection.length}
          >
            Clear
          </Button>
          <Button size="xs" onClick={apply} disabled={!selection.length}>
            Apply
          </Button>
        </Group>
      )}
    </Box>
  );
}

export const CategoryFilter = forwardRef(Category);
export const SubCategoryFilter = forwardRef(SubCategory);
