import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { ENDPOINTS } from "../constants/endpoints";
import { getAuthToken } from "../utils";

function getUserData() {
  return axios.get(ENDPOINTS.userInfo);
}

/**
 *
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
function useUserData(options) {
  return useQuery(["user"], getUserData, options);
}

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
    onSuccess: (res) => setUserData(res.data?.response),
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
