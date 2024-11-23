import { Book, PersonOutline } from "@mui/icons-material";
import { AppBar, Toolbar, Box, Typography, Avatar } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import stringToColor from "../utils/stringToColor";

const Header = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        sx={{
          padding: 1,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
        disableGutters
      >
        {/* Left */}
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Book sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 500,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ebooks
          </Typography>
        </Box>

        {/* Center */}
        <Box sx={{ display: "flex", alignItems: "center", padding: "6px" }}>
          <SearchBar width="28rem" />
        </Box>

        {/* Right */}
        {isAuthenticated && user ? (
          <Box
            component={NavLink}
            to="/dashboard"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              paddingX: "1rem",
              paddingY: "0.6rem",
              fontSize: "1rem",
            }}
            className="link-button"
          >
            <Avatar
              sx={{
                bgcolor: stringToColor(user.username),
                width: 40,
                height: 40,
                fontSize: "1rem",
              }}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            {user.username}
          </Box>
        ) : (
          <Box
            component={NavLink}
            to="/signin"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              paddingX: "1rem",
              paddingY: "0.6rem",
              fontSize: "1.2rem",
            }}
            className="link-button"
          >
            <PersonOutline sx={{ fontSize: "2rem !important", mr: 1 }} />
            Login
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
