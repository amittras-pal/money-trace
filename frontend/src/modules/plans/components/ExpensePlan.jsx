import {
  ActionIcon,
  Box,
  Divider,
  Menu,
  Text,
  createStyles,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";

export default function ExpensePlan({ data, onPlanAction, hideMenu }) {
  const { classes } = usePlanStyles();

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.details}>
        <Box>
          <Text
            size="md"
            fw="bold"
            m={0}
            td={!data.open ? "line-through" : ""}
            color={!data.open ? "dimmed" : ""}
            component={hideMenu ? "p" : Link}
            to={`/plans/${data._id}`}
          >
            {data.name}
          </Text>
          <Text size="xs" color="dimmed" sx={{ whiteSpace: "pre-wrap" }}>
            {data.description}
          </Text>
        </Box>
        {!hideMenu && (
          <>
            {data?.open ? (
              <Menu shadow="md" position="bottom-end">
                <Menu.Target>
                  <ActionIcon size="sm" radius="xl" variant="light">
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconEdit size={14} />}
                    onClick={() => onPlanAction(data, "edit")}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    icon={<IconX size={14} />}
                    onClick={() => onPlanAction(data, "close")}
                  >
                    Close
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <ActionIcon
                color="red"
                variant="light"
                radius="xl"
                onClick={() => onPlanAction(data, "delete")}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </>
        )}
        {/* {data.open && !hideMenu && (
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon size="sm" radius="xl" variant="light">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<IconEdit size={14} />}
                onClick={() => onPlanAction(data, "edit")}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                color="red"
                icon={<IconTrash size={14} />}
                onClick={() => onPlanAction(data, "delete")}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )} */}
      </Box>
      <Divider mb="sm" mt="auto" />
      <Text size="sm">
        Last Updated: {dayjs(data.updatedAt).format("DD MMM 'YY, hh:mm a")}
      </Text>
    </Box>
  );
}

const usePlanStyles = createStyles((theme) => ({
  wrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.dark[6],
  },
  details: {
    display: "flex",
    gap: theme.spacing.xs,
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
}));
