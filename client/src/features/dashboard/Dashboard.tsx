import { Avatar, Box, Divider, Paper, Typography } from "@mui/material";
import stringToColor from "../../app/utils/stringToColor";
import { useAuth } from "../../app/context/AuthContext";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutline from "@mui/icons-material/PersonOutline";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        gap: "1.5rem",
        alignItems: "start",
        mx: "5rem",
        marginTop: "1rem",
        marginBottom: "3rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1",
          width: "100%",
          minHeight: "inherit",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            minHeight: "inherit",
            p: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "auto",
                aspectRatio: "1",
                padding: "1rem",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: stringToColor(user.username),
                  width: "100%",
                  height: "100%",
                  fontSize: "5rem",
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
            </Box>
            <Typography fontSize="1.2rem" fontWeight={600}>
              {user.username}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "start",
              }}
            >
              <Divider sx={{ width: "100%", paddingTop: "1rem" }} />
              <Box
                component={NavLink}
                to="/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  paddingX: "1rem",
                  paddingY: "0.6rem",
                  fontSize: "1rem",
                }}
                className="link-button"
              >
                <PersonOutline sx={{ fontSize: "1.5rem !important", mr: 1 }} />
                My info
              </Box>
              <Divider sx={{ width: "100%" }} />
              <Box
                component={NavLink}
                to="/dashboard/books"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  paddingX: "1rem",
                  paddingY: "0.6rem",
                  fontSize: "1rem",
                }}
                className="link-button"
              >
                <CollectionsBookmarkIcon
                  sx={{ fontSize: "1.5rem !important", mr: 1 }}
                />
                My books
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "start",
            }}
          >
            <Box
              component={NavLink}
              to="/dashboard/settings"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                paddingX: "1rem",
                paddingY: "0.6rem",
                fontSize: "1rem",
              }}
              className="link-button"
            >
              <SettingsIcon sx={{ fontSize: "1.5rem !important", mr: 1 }} />
              Settings
            </Box>
            <Divider sx={{ width: "100%" }} />
            <Box
              component={NavLink}
              to="/logout"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                paddingX: "1rem",
                paddingY: "0.6rem",
                fontSize: "1rem",
              }}
              className="link-button"
            >
              <LogoutIcon sx={{ fontSize: "1.5rem !important", mr: 1 }} />
              Logout
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "4",
          width: "100%",
          minHeight: "inherit",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            width: "100%",
            minHeight: "inherit",
            p: "1rem",
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
