import React, { useContext } from "react"
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from "./userContext.tsx"

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { userName } = useContext(UserContext);
  const isAuthenticated = userName !== "";
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
}