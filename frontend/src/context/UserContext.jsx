import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useErrorHandler } from "../hooks/errorHandler";
import { useUserData } from "../services/auth.service";
import { useBudget } from "../services/budget.service";

const UserContext = createContext({
  loggedIn: false,
  userData: {},
  cMBudget: 0,
  loadingRequisites: false,
});

export function useAuth() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { onError } = useErrorHandler();

  //TODO: Add Changelog view if user has a changelog not viewed.

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

  const { isLoading: loadingBudget, data: budget } = useBudget(
    dayjs().month() + 1,
    dayjs().year(),
    {
      onError,
      enabled: loggedIn,
      staleTime: 3600,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        userData,
        loadingRequisites: loadingUserData || loadingBudget,
        cMBudget: budget?.data?.response?.amount,
      }}>
      {children}
    </UserContext.Provider>
  );
}
