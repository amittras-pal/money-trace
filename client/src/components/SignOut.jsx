import { ActionIcon, Divider, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Logout, Power, X } from "tabler-icons-react";
import { isAuthenticated } from "../utils/app.utils";

function SignOut() {
  const { openConfirmModal } = useModals();
  const navigate = useNavigate();

  const initiateLogout = () => {
    openConfirmModal({
      title: "Logout?",
      children: (
        <>
          <Text size="lg" weight={700}>
            Are you sure you want to logout?
          </Text>
          <Divider variant="dashed" my="md" />
        </>
      ),
      labels: { confirm: "Sign Out", cancel: "Cancel" },
      confirmProps: { leftIcon: <Logout />, size: "sm", color: "red" },
      cancelProps: { leftIcon: <X />, size: "sm", color: "gray" },
      withCloseButton: false,
      onConfirm: () => {
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  if (!isAuthenticated()) return null;

  return (
    <ActionIcon
      ml="auto"
      size={32}
      radius="xl"
      variant="filled"
      color="indigo"
      onClick={initiateLogout}>
      <Power size={24} />
    </ActionIcon>
  );
}

export default SignOut;
