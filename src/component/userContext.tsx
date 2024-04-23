import React from "react"

export const UserContext = React.createContext<{
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}>({
  userName: "",
  setUserName: () => {
  }
})

export const setUser = (userName: string, setuserName: React.Dispatch<React.SetStateAction<string>>) => {
  localStorage.setItem("userName", userName)
  setuserName(userName)
}