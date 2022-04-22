import { useNotifications } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "tabler-icons-react";

export function useErrorHandler() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { showNotification } = useNotifications();

  const onError = (err, func) => {
    console.log(err.response);
    if (err.response.status === 401 && pathname !== "/login") {
      showNotification({
        title: "Session Expired or Invalid Session",
        message: "Please login again to continue.",
        color: "red",
        icon: <X />,
      });
      navigate("/login");
    } else {
      func?.();
    }
  };

  return { onError };
}
