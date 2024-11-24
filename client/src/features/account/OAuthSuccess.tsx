import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setAuthToken(token);
      navigate("/dashboard");
    } else {
      console.error("OAuth token missing");
    }
  }, [navigate, setAuthToken]);

  return <div>Logging you in...</div>;
};

export default OAuthSuccess;
