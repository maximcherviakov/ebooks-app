import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.token || user.token.length === 0) {
    return <Navigate to={"/signin"} state={{ from: location }} />;
  }

  return <Outlet />;
}
