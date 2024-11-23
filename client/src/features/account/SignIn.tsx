import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import agent from "../../app/api/agent";
import { GitHubIcon, GoogleIcon } from "../../app/components/CustomIcons";
import { useAuth } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const payload = {
        email: data.get("email")?.toString() || "",
        password: data.get("password")?.toString() || "",
      };

      const response = await agent.User.signIn(payload);

      const user = response;
      login(user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        maxHeight: "100vh",
        height: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: "30rem",
            padding: "2rem",
            borderRadius: "1rem",
          }}
        >
          <Typography variant="h4" fontWeight={600} paddingBottom="0.5rem">
            Sign in
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{
                  borderRadius: "100px",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Button
                fullWidth
                type="submit"
                variant="contained"
                onClick={validateInputs}
                sx={{
                  borderRadius: "1000px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  px: "5rem",
                  py: "0.5rem",
                }}
              >
                Sign in
              </Button>
            </Box>
          </Box>
          <Divider sx={{ py: "0.5rem" }}>or</Divider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => alert("Sign in with Google")}
              startIcon={<GoogleIcon />}
              sx={{ borderRadius: "1000px", py: "0.5rem" }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with GitHub")}
              startIcon={<GitHubIcon />}
              sx={{ borderRadius: "1000px", py: "0.5rem" }}
            >
              GitHub
            </Button>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" variant="body1" sx={{ alignSelf: "center" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
      <Box sx={{ height: "100%" }}>
        <img
          height="100%"
          src="/public/assets/images/library.jpg"
          alt="Library image"
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
}
