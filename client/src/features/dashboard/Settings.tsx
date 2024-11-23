import { Box, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";
import ThemeSwitcher from "../../app/components/ThemeSwitcher";

const Settings = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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
      }}
    >
      <Typography variant="h4">Settings</Typography>
      <Divider sx={{ width: "100%", my: "0.5rem" }} />

      <ThemeSwitcher />
    </Box>
  );
};

export default Settings;
