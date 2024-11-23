import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Book } from "../models/book";
import { NavLink } from "react-router-dom";

interface Props {
  book: Book;
}

const BookCard = ({ book }: Props) => {
  const { _id, title, author, thumbnailFileName } = book;
  return (
    <Card className="card-shadow">
      <CardActionArea component={NavLink} to={`/book/${_id}`}>
        <CardMedia
          component="img"
          image={`/api/books/thumbnail/${thumbnailFileName}`}
          alt={title}
        />
      </CardActionArea>
      <CardContent sx={{ py: "6px !important", px: "4px !important" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Typography
            component={NavLink}
            to={`/book/${_id}`}
            variant="body1"
            align="center"
            fontWeight={700}
            title={title}
            sx={{
              color: "text.primary",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "3rem",
              lineHeight: "1.5rem",
            }}
          >
            {title}
          </Typography>
          <Typography align="center" variant="body2">
            {author}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;
