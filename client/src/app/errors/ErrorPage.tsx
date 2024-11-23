import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  code: number;
  title: string;
  description: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, description }) => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        {code}
      </Typography>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {description}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Container>
  );
};

export default ErrorPage;
