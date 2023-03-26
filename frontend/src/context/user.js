import { createContext, useContext, useState } from "react";

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
  return (
    <UserContext.Provider value={{ userData, setUserData, budget, setBudget }}>
      {children}
    </UserContext.Provider>
  );
}
