import React from "react"

export const UserContext = React.createContext<{
  userName: string;
  setuserName: React.Dispatch<React.SetStateAction<string>>;
}>({
  userName: "",
  setuserName: () => {
  }
})

export const setUser = (userName: string, setuserName: React.Dispatch<React.SetStateAction<string>>) => {
  localStorage.setItem("userName", userName)
  setuserName(userName)
}