import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import { useEffect } from "react";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return null;
};

export default Logout;
