import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Loader,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconAdjustments, IconLogout, IconPower, IconX } from "@tabler/icons";
import React from "react";
import { useAuth } from "../../../context/UserContext";
import { openConfirmModal } from "@mantine/modals";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

export default function GlobalUser({ setOpened }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userData, loadingRequisites } = useAuth();
  const client = useQueryClient();

  const confirmLogout = () => {
    openConfirmModal({
      title: "Sure to Logout?",
      children: (
        <>
          <Text size="lg">Are you sure you want to logout?</Text>
          <Divider variant="dashed" my="md" color="red" />
        </>
      ),
      labels: { confirm: "Sign Out", cancel: "Stay Logged In" },
      confirmProps: {
        leftIcon: <IconLogout />,
        size: "xs",
        color: "red",
        m: 4,
      },
      cancelProps: { leftIcon: <IconX />, size: "xs", color: "gray", m: 4 },
      withCloseButton: false,
      closeOnCancel: true,
      onConfirm: () => {
        localStorage.clear();
        client.clear();
        window.dispatchEvent(new Event("storage"));
        setOpened(false);
        navigate("/login");
      },
    });
  };

  return (
    <Box
      px="sm"
      py="md"
      sx={{
        borderTop: `1px solid ${theme.colors.dark[4]}`,
      }}>
      <Group>
        {loadingRequisites ? (
          <Loader size="sm" />
        ) : (
          <>
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {userData?.name}
              </Text>
              <Text color="dimmed" size="xs">
                {userData?.email}
              </Text>
            </Box>

            <Tooltip position="top" label="User Settings">
              <ActionIcon
                color="indigo"
                size="lg"
                radius="xl"
                variant={pathname === "/me" ? "filled" : "light"}
                component={Link}
                onClick={() => setOpened(false)}
                to="/me">
                <IconAdjustments size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip position="top" label="Sign Out" onClick={confirmLogout}>
              <ActionIcon color="red" size="lg" radius="xl" variant="light">
                <IconPower size={16} />
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </Group>
    </Box>
  );
}
