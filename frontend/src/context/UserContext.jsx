import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({
  loggedIn: false,
});

export function useAuth() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  // TODO: Prepare user details here.
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const listener = () => {
      setLoggedIn(localStorage.getItem("token") ? true : false);
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  return (
    <UserContext.Provider value={{ loggedIn, userData }}>
      {children}
    </UserContext.Provider>
  );
}
