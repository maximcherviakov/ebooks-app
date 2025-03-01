import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import ThemeSwitcher from "../../app/components/ThemeSwitcher";
import PasswordReset from "../account/PasswordReset";

const Settings = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    navigate("/signin");
    return;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "100%",
        height: "100%",
        gap: "1rem",
      }}
    >
      <Typography variant="h4">Settings</Typography>
      <Divider sx={{ width: "100%", my: "0.5rem" }} />

      <ThemeSwitcher />

      <PasswordReset />
    </Box>
  );
};

export default Settings;
