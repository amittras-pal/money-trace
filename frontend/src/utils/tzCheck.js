import { Box, Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconClockCheck, IconClockExclamation } from "@tabler/icons-react";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useUpdateUser } from "../services/user";
import { useCurrentUser } from "../context/user";

export function useTZChangeDetection() {
  const { onError } = useErrorHandler();
  const { setUserData } = useCurrentUser();
  const { mutate: updateTZ, isLoading } = useUpdateUser({
    onSuccess: (res) => {
      console.log(res.data?.response);
      notifications.hide("tz-change");
      notifications.show({
        title: "Timezone updated successfully!",
        color: "green",
        icon: <IconClockCheck size={16} />,
      });
      setUserData(res?.data?.response);
    },
    onError,
  });

  const checkTZChange = (tzOnRecord) => {
    const systemTZ = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tzOnRecord !== systemTZ)
      notifications.show({
        title: "Timezone Change Detected",
        id: "tz-change",
        autoClose: false,
        color: "red",
        withCloseButton: false,
        icon: <IconClockExclamation size={16} />,
        message: (
          <Box>
            <Text size="sm">
              Your set timezone {tzOnRecord} is different from your browser's
              timezone {systemTZ}. Would you like update your default timezone?
            </Text>
            <Group grow mt="sm">
              <Button
                size="xs"
                variant="outline"
                color="red"
                onClick={() => notifications.hide("tz-change")}
              >
                No
              </Button>
              <Button
                size="xs"
                loading={isLoading}
                onClick={() => updateTZ({ timeZone: systemTZ })}
              >
                Yes!
              </Button>
            </Group>
          </Box>
        ),
      });
  };

  return { checkTZChange };
}
