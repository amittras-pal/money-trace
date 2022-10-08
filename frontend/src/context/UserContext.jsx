import { createContext, useContext, useEffect, useState } from "react";
import { useErrorHandler } from "../hooks/errorHandler";
import { useUserData } from "../services/auth.service";

const UserContext = createContext({
  loggedIn: false,
  userData: {},
  loadingUserData: false,
});

export function useAuth() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { onError } = useErrorHandler();

  useEffect(() => {
    const listener = () => {
      setLoggedIn(localStorage.getItem("token") ? true : false);
    };
    setLoggedIn(localStorage.getItem("token") ? true : false);
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const { isLoading: loadingUserData } = useUserData({
    onSuccess: (res) => {
      setUserData(res?.data?.response);
    },
    onError,
    enabled: loggedIn,
    staleTime: 3600,
    refetchOnWindowFocus: false,
  });

  return (
    <UserContext.Provider value={{ loggedIn, userData, loadingUserData }}>
      {children}
    </UserContext.Provider>
  );
}
