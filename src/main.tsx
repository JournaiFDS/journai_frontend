import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import PrivateRoute from "./component/privateRoute.tsx"
import Layout from "./layouts/layout.tsx"
import DailyNote from "./pages/dailyNote.tsx"
import AuthCard from "./pages/authCard.tsx"
import Profile from "./pages/profile.tsx"
import { UserContext } from "./component/userContext.tsx"
import CalendarView from "./pages/calendarView.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <DailyNote />
          </PrivateRoute>
        )
      },
      {
        path: "auth",
        element:
          <AuthCard />
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        )
      },
      {
        path: "dailyNote",
        element: (
          <PrivateRoute>
            <DailyNote />
          </PrivateRoute>
        )
      },
      {
        path: "calendarView",
        element: (
          <PrivateRoute>
            <CalendarView />
          </PrivateRoute>
        )
      }
    ]
  },
  {}
])

export const Main = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "")

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId") || "")
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <React.StrictMode>
      <UserContext.Provider value={{ userId, setUserId }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />)