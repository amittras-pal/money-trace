import { createContext, useContext, useEffect, useState } from "react";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { getAuthToken } from "../utils";
import { useTZChangeDetection } from "../utils/tzCheck";
import { useUserData } from "../services/user";

const UserContext = createContext({
  userData: null,
  budget: null,
  setUserData: () => null,
  setBudget: () => null,
});

export function useCurrentUser() {
  return useContext(UserContext);
}

export default function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { onError } = useErrorHandler();
  const { checkTZChange } = useTZChangeDetection();

  useEffect(() => {
    const listener = () => {
      setLoggedIn(getAuthToken() ? true : false);
    };
    setLoggedIn(getAuthToken() ? true : false);
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  // TODO: handle this.
  // eslint-disable-next-line no-unused-vars
  const { isLoading: loadingUser } = useUserData({
    onSuccess: (res) => {
      checkTZChange(res?.data?.response?.timeZone);
      setUserData(res.data?.response);
    },
    onError,
    enabled: loggedIn,
    staleTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <UserContext.Provider value={{ userData, setUserData, budget, setBudget }}>
      {children}
    </UserContext.Provider>
  );
}
