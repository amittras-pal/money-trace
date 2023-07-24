import React from "react";
import { useCurrentUser } from "../../context/user";

export default function User() {
  const { userData } = useCurrentUser();
  console.log(userData);
  return <pre>{JSON.stringify(userData, null, 2)}</pre>;
}
