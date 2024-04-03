import React from "react"

export const UserContext = React.createContext<{
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}>({
  userId: "",
  setUserId: () => {
  }
})

export const setUser = (userId: string, setUserId: React.Dispatch<React.SetStateAction<string>>) => {
  localStorage.setItem("userId", userId)
  setUserId(userId)
}