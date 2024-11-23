import { Box, Button, Divider, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Book } from "../../app/models/book";
import agent from "../../app/api/agent";
import BookCard from "../../app/components/BookCard";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("limit", "12");
    params.append("sort", "createdAt");
    params.append("sortOrder", "desc");

    agent.Book.list(params)
      .then((response) => {
        setBooks(response.books);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "start",
        alignItems: "center",
        mx: "5rem",
        marginTop: "1rem",
        marginBottom: "3rem",
      }}
    >
      <Box width="100%">
        <Typography variant="h4">Recently uploaded</Typography>
      </Box>
      <Divider sx={{ marginBottom: "1rem", width: "100%" }} />
      <Grid2 container spacing={2} width="100%">
        {books.map((book) => (
          <Grid2 size={2} key={book._id}>
            <BookCard book={book} />
          </Grid2>
        ))}
      </Grid2>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ marginTop: "1.5rem" }}
      >
        <Button
          component={NavLink}
          to="/catalog"
          variant="contained"
          sx={{
            borderRadius: "1000px",
            fontSize: "1rem",
            fontWeight: 600,
            px: "3rem",
          }}
        >
          More...
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
