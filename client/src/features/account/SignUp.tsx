import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Card } from "@mui/material";

export default function SignUp() {
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const validateInputs = () => {
    const username = document.getElementById("username") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!username.value) {
      setNameError(true);
      setNameErrorMessage("Please enter a username.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

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
            Sign up
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
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                id="username"
                type="text"
                name="username"
                placeholder="yourusername"
                autoComplete="username"
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
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
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
                Sign up
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Already signed up{" "}
              <Link href="/signin" variant="body1" sx={{ alignSelf: "center" }}>
                Sign in
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
