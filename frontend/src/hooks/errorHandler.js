import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

export function useErrorHandler() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const client = useQueryClient();

  const onError = (err, func) => {
    if (err.response.status === 401 && pathname !== "/login") {
      localStorage.clear();
      client.clear();
      window.dispatchEvent(new Event("storage"));
      showNotification({
        title: "Session Expired or Invalid Session",
        message: "Please login again to continue.",
        color: "red",
        icon: <IconX />,
      });
      navigate("/login");
    } else {
      func?.();
    }
  };

  return { onError };
}
