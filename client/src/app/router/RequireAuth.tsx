import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { token } = useAuth();
  const location = useLocation();

  if (!token || token.length === 0) {
    return <Navigate to={"/signin"} state={{ from: location }} />;
  }

  return <Outlet />;
}
