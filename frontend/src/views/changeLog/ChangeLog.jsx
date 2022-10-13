import {
  Button,
  createStyles,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useQueryClient } from "react-query";
import { useAuth } from "../../context/UserContext";
import { useErrorHandler } from "../../hooks/errorHandler";
import { useUpdateUser } from "../../services/auth.service";
import { useChangelog } from "../../services/changelog.service";

export default function ChangeLog() {
  const {
    viewChangelog,
    setViewChangelog,
    loadingRequisites,
    loggedIn,
    userData,
  } = useAuth();
  const { classes } = useStyles();
  const { breakpoints } = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
  const { onError } = useErrorHandler();

  const client = useQueryClient();
  const { mutate: markChangelogVIewed, isLoading: updatingChangelogState } =
    useUpdateUser({
      onSuccess: (res) => {
        client.invalidateQueries("user-details");
      },
      onError,
    });

  const { data, isLoading: loadingChangelog } = useChangelog({
    enabled: loggedIn && viewChangelog,
    onError,
  });

  const handleViewChangelog = () => {
    if (userData.hasUnseenChangelog) setViewChangelog(false);
    else markChangelogVIewed({ hasUnseenChangelog: false });
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
        <ScrollArea style={{ height: "65vh" }}>
          <Text className={classes.markdownContent} component={ReactMarkdown}>
            {data?.data?.response?.content}
          </Text>
        </ScrollArea>
      )}
      <Group position="right" mt="md">
        <Button
          size="sm"
          mr={6}
          mb={4}
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

const useStyles = createStyles((theme) => ({
  markdownContent: {
    "p, h1, h2, h3, h4, h5, h6, ul": {
      marginTop: 0,
    },
    p: {
      marginBottom: theme.spacing.md,
    },
    a: {
      textDecoration: "none",
      color: theme.colors.indigo[3],
      opacity: 0.7,
      fontWeight: 500,
      transition: "opacity 0.2s ease-in-out",
      "&:hover, &:focus": {
        opacity: 1,
        textDecoration: "underline",
      },
    },
    img: {
      width: "100%",
      height: "auto",
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.md,
    },
  },
}));
