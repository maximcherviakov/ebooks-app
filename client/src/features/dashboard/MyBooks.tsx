import { Box, Typography, Divider, Grid2, Button } from "@mui/material";
import { Book } from "../../app/models/book";
import agent from "../../app/api/agent";
import { useState, useEffect } from "react";
import UserBookCard from "../../app/components/UserBookCard";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "react-router-dom";

const MyBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    agent.Book.myList()
      .then((response) => {
        setBooks(response.books);
        console.log(response.books);
      })
      .catch((error) => console.log(error));
  }, []);

  const removeBook = (bookId: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "inherit",
        width: "100%",
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box>
          <Typography variant="h4">My books</Typography>
        </Box>
        <Button
          component={NavLink}
          to="/book/create"
          variant="contained"
          color="info"
          startIcon={<AddIcon />}
          sx={{ borderRadius: "100px" }}
        >
          Add book
        </Button>
      </Box>
      <Divider sx={{ width: "100%", my: "0.5rem" }} />

      {!books || books.length === 0 ? (
        <Typography
          variant="body1"
          color="secondary"
          fontSize="1.2rem"
          alignSelf="center"
          sx={{ my: "auto" }}
        >
          You have not uploaded any book yet
        </Typography>
      ) : (
        <Grid2 container spacing={2} width="100%">
          {books.map((book) => (
            <Grid2 size={2} key={book._id}>
              <UserBookCard book={book} removeBookHandler={removeBook} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default MyBooks;
