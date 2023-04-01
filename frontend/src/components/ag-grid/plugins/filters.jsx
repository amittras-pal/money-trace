import {
  Box,
  Button,
  Checkbox,
  createStyles,
  Group,
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
import { getChildren, getParents } from "../../../constants/categories";

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

  const cleanup = () => {
    props.api.destroyFilter("subCategory");
    props.api.hidePopupMenu();
  };

  const apply = () => {
    props.filterChangedCallback();
    cleanup();
  };

  const clear = () => {
    props.api.destroyFilter("category");
    cleanup();
  };

  return (
    <Box className={classes.wrapper}>
      <Text fw="bold" mb="sm">
        Filter Categories
      </Text>
      <Checkbox.Group value={categories} onChange={setCategories}>
        <Group spacing="xs" className={classes.selectionGroup}>
          {options.map((opt) => (
            <Checkbox
              key={opt.label}
              label={opt.label}
              value={opt.value}
              color={opt.color}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Group>
      </Checkbox.Group>
      <Group grow mt="sm" sx={{ position: "sticky", bottom: 0 }}>
        <Button
          size="xs"
          variant="light"
          onClick={clear}
          disabled={!categories.length}
        >
          Clear
        </Button>
        <Button size="xs" onClick={apply} disabled={!categories.length}>
          Apply
        </Button>
      </Group>
    </Box>
  );
}

function SubCategory(props, ref) {
  const [categories, setCategories] = useState([]);
  const { classes } = useStyles();

  const options = useMemo(() => {
    const instance = props.api.getFilterInstance("category");
    if (!instance || !instance?.isFilterActive()) return [];

    const primCatSelection = instance?.getModel();
    const avSubCats = new Set();
    props.api.forEachNode((node) => avSubCats.add(node.data.subCategory));

    const secSelectable = [];

    primCatSelection.forEach((cat) => {
      secSelectable.push({
        category: cat,
        children: getChildren(cat).filter((opt) => avSubCats.has(opt.value)),
      });
    });

    return secSelectable;
  }, [props.api]);

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params) {
        return categories.length
          ? categories.includes(params.data.subCategory)
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
    props.api.destroyFilter("subCategory");
    props.api.hidePopupMenu();
  };

  return (
    <Box className={classes.wrapper}>
      <Text fw="bold" mb="sm">
        Filter Sub Categories
      </Text>
      <ScrollArea h={options.length > 0 ? 200 : 75}>
        {options.length > 0 ? (
          <Checkbox.Group value={categories} onChange={setCategories}>
            <Group spacing="xs" className={classes.selectionGroup}>
              {options.map((opt) => (
                <Fragment key={opt.category}>
                  <Text fz="xs" color={opt.children[0].color}>
                    {opt.category}
                  </Text>
                  {opt.children.map((child) => (
                    <Checkbox
                      key={child.label}
                      label={child.label}
                      value={child.value}
                      color={child.color}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Fragment>
              ))}
            </Group>
          </Checkbox.Group>
        ) : (
          <Text ta="center" color="dimmed">
            Please select one or more categories first to filter by
            subcategories.
          </Text>
        )}
      </ScrollArea>
      {options.length > 0 && (
        <Group grow mt="sm" sx={{ position: "sticky", bottom: 0 }}>
          <Button
            size="xs"
            variant="light"
            onClick={clear}
            disabled={!categories.length}
          >
            Clear
          </Button>
          <Button size="xs" onClick={apply} disabled={!categories.length}>
            Apply
          </Button>
        </Group>
      )}
    </Box>
  );
}

export const CategoryFilter = forwardRef(Category);
export const SubCategoryFilter = forwardRef(SubCategory);
