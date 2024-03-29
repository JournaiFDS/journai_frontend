import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./component/privateRoute.tsx";
import { AuthProvider } from "./component/authContext.tsx";
import Index from "./pages";
import Layout from "./layouts/layout.tsx";
import Today from "./pages/add-today.tsx";
import AuthCard from "./pages/authCard.tsx";
import { CalendarView } from "./pages/calender-view.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        )
      },
      {
        path: "auth",
        element:
          <AuthCard />
      },
      {
        path: "dailyNote",
        element: (
          <PrivateRoute>
            <Today />
          </PrivateRoute>
        )
      },
      {
        path: "calendarReview",
        element: (
          <PrivateRoute>
            <CalendarView />
          </PrivateRoute>
        )
      }
    ]
  },
  {}
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
