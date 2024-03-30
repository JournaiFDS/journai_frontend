import React from "react"

export const UserContext = React.createContext<{
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}>({
  userId: "",
  setUserId: () => {
  }
})