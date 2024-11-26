import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import { Box, Typography } from "@mui/material";

const OAuthSuccess = () => {
  const [queryParams] = useSearchParams();
  const { isAuthenticated, user, setAuthToken } = useAuth();

  useEffect(() => {
    const token = queryParams.get("token");

    if (token) {
      setAuthToken(token);
    } else {
      console.error("OAuth token missing");
    }
  }, [isAuthenticated, queryParams, setAuthToken]);

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        mx: "5rem",
        marginTop: "1rem",
        marginBottom: "3rem",
      }}
    >
      <Typography variant="h5">Logging you in...</Typography>
    </Box>
  );
};

export default OAuthSuccess;
