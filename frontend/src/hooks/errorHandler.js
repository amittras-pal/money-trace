import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { useLocation, useNavigate } from "react-router-dom";

export function useErrorHandler() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onError = (err, func) => {
    if (err.response.status === 401 && pathname !== "/login") {
      localStorage.clear();
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
