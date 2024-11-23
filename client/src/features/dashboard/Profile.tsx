import { Box, Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthContext";

const Profile = () => {
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
      <Typography variant="h4">Profile</Typography>
      <Divider sx={{ width: "100%", my: "0.5rem" }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
            height: "100%",
            gap: "0.5rem",
          }}
        >
          <Typography variant="h6">User name: {user.username}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
