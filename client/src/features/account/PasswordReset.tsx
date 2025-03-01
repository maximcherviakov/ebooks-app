import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Card,
  Alert,
  CircularProgress,
} from "@mui/material";
import agent from "../../app/api/agent";

export default function PasswordReset() {
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] =
    useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThirdPartyUser, setIsThirdPartyUser] = useState(false);
  const [isCheckingUserType, setIsCheckingUserType] = useState(true);

  // Check if the user is authenticated via a third-party provider
  useEffect(() => {
    const checkUserAuthMethod = async () => {
      try {
        const userData = await agent.User.current();
        // If user has any third-party ID (googleId, facebookId, etc.), they're a third-party user
        setIsThirdPartyUser(
          !!(
            userData.googleId ||
            userData.facebookId ||
            userData.appleId ||
            userData.twitterId
          )
        );
      } catch (error) {
        console.error("Error checking user authentication method:", error);
        setErrorMessage(
          "Failed to verify account type. Please try again later."
        );
      } finally {
        setIsCheckingUserType(false);
      }
    };

    checkUserAuthMethod();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!validateInputs()) return;

      const form = event.currentTarget as HTMLFormElement;

      setIsLoading(true);
      const data = new FormData(event.currentTarget);
      const payload = {
        currentPassword: data.get("currentPassword")?.toString() || "",
        newPassword: data.get("newPassword")?.toString() || "",
      };

      await agent.User.resetPassword(payload);

      // Clear form fields
      form.reset();

      // Show success message
      setSuccessMessage("Password successfully updated");
      setErrorMessage("");
    } catch (error: unknown) {
      console.log("Error updating password:", error);

      let errorMsg = "Failed to update password. Please try again.";
      // Check if error is an object with response property
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMsg = axiosError.response.data.message;
        }
      }
      setErrorMessage(errorMsg);
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    const currentPassword = document.getElementById(
      "currentPassword"
    ) as HTMLInputElement;
    const newPassword = document.getElementById(
      "newPassword"
    ) as HTMLInputElement;
    const confirmPassword = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;

    let isValid = true;

    if (!currentPassword.value) {
      setCurrentPasswordError(true);
      setCurrentPasswordErrorMessage("Please enter your current password");
      isValid = false;
    } else {
      setCurrentPasswordError(false);
      setCurrentPasswordErrorMessage("");
    }

    if (!newPassword.value || newPassword.value.length < 6) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage("");
    }

    if (newPassword.value !== confirmPassword.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    return isValid;
  };

  // Show loading state while checking user authentication method
  if (isCheckingUserType) {
    return (
      <Card
        sx={{
          p: 3,
          mb: 4,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  // If user is authenticated via a third-party provider, show message instead of password reset form
  if (isThirdPartyUser) {
    return (
      <Card sx={{ p: 3, mb: 4, width: "100%" }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Password Settings
        </Typography>
        <Alert severity="info">
          Password management is not available for accounts created using
          third-party authentication providers. Your account security is managed
          through your third-party provider's account settings.
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, mb: 4, width: "100%" }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Change Password
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
          <TextField
            error={currentPasswordError}
            helperText={currentPasswordErrorMessage}
            name="currentPassword"
            placeholder="••••••"
            type="password"
            id="currentPassword"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel htmlFor="newPassword">New Password</FormLabel>
          <TextField
            error={newPasswordError}
            helperText={newPasswordErrorMessage}
            name="newPassword"
            placeholder="••••••"
            type="password"
            id="newPassword"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
          <TextField
            error={confirmPasswordError}
            helperText={confirmPasswordErrorMessage}
            name="confirmPassword"
            placeholder="••••••"
            type="password"
            id="confirmPassword"
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: "1000px",
            fontSize: "1rem",
            fontWeight: 600,
            px: "2rem",
            py: "0.5rem",
          }}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </Box>
    </Card>
  );
}
