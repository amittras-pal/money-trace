import {
  Button,
  Group,
  Loader,
  Modal,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useQueryClient } from "react-query";
import { useAuth } from "../../context/UserContext";
import { useUpdateUser } from "../../services/auth.service";
import { useChangelog } from "../../services/changelog.service";

export default function ChangeLog() {
  const { viewChangelog, loadingRequisites, loggedIn } = useAuth();
  const { breakpoints } = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.md}px)`);

  const client = useQueryClient();
  const { mutate: markChangelogVIewed, isLoading: updatingChangelogState } =
    useUpdateUser({
      onSuccess: (res) => {
        client.invalidateQueries("user-details");
      },
    });

  const { data, isLoading: loadingChangelog } = useChangelog({
    enabled: loggedIn,
  });

  const handleViewChangelog = () => {
    markChangelogVIewed({ hasUnseenChangelog: false });
  };

  return (
    <Modal
      opened={viewChangelog}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      size="lg">
      {loadingChangelog ? (
        <Group position="center" py="lg">
          <Loader size={40} />
        </Group>
      ) : (
        <Text component={ReactMarkdown}>{data?.data?.response?.content}</Text>
      )}
      <Group position="right" mt="md">
        <Button
          size="sm"
          fullWidth={isSmallScreen}
          onClick={handleViewChangelog}
          disabled={loadingChangelog}
          loading={updatingChangelogState || loadingRequisites}>
          Got it!!
        </Button>
      </Group>
    </Modal>
  );
}
