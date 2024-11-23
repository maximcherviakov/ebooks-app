import { CssBaseline, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ThemeContextProvider } from "../context/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CssBaseline />
        <ScrollToTop />
        <Header />
        <Box minHeight="100vh">
          <Outlet />
        </Box>
        <Footer />
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
