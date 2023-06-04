import { useLocation, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

export function useErrorHandler() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onError = (err, func) => {
    if (err.response.status === 401 && pathname !== "/login") {
      localStorage.clear();
      notifications.show({
        title: "Session Expired / Invalid Session",
        message: "Please login again to continue",
        color: "red",
        icon: <IconX />,
      });
      navigate("/login");
    } else {
      notifications.show({
        message: err?.response?.data?.message,
        color: "red",
        icon: <IconX />,
      });
    }
  };
  return { onError };
}
