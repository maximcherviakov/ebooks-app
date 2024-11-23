import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { Book } from "../models/book";
import { NavLink, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import agent from "../api/agent";
import { useState } from "react";

interface Props {
  book: Book;
  removeBookHandler: (bookId: string) => void;
}

const USerBookCard = ({ book, removeBookHandler }: Props) => {
  const { _id, title, author, thumbnailFileName } = book;
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleCardClick = () => {
    navigate(`/book/${_id}`);
  };

  const handleEditClick = () => {
    navigate(`/book/edit/${_id}`);
  };

  const handleDeleteClick = () => {
    handleModalClose();
    agent.Book.delete(_id)
      .then(() => {
        removeBookHandler(_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Card
        className="card-shadow"
        sx={{
          position: "relative",
          "&:hover .hover-buttons": {
            opacity: 1,
            visibility: "visible",
          },
        }}
      >
        <Box
          onClick={handleCardClick}
          sx={{
            cursor: "pointer",
            transition: "all .25s ease",
            "&:hover": {
              opacity: 0.85,
            },
          }}
        >
          <CardMedia
            component="img"
            image={`/api/books/thumbnail/${thumbnailFileName}`}
            alt={title}
          />
          <Box
            className="hover-buttons"
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "0 0 100px 100px",
              overflow: "hidden",
              position: "absolute",
              top: 0,
              right: 10,
              gap: "4px",
              opacity: 0,
              padding: "6px 4px",
              visibility: "hidden",
              transition: "opacity 0.3s, visibility 0.3s",
              zIndex: 10,
              backgroundColor: "rgba(36, 36, 36, .80)",
            }}
          >
            <IconButton
              color="warning"
              sx={{
                p: "4px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
            >
              <EditIcon
                sx={{
                  height: "22px",
                  width: "22px",
                }}
              />
            </IconButton>

            <IconButton
              color="error"
              sx={{
                p: "4px",
                marginTop: "4px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleModalOpen();
              }}
            >
              <DeleteIcon
                sx={{
                  height: "22px",
                  width: "22px",
                }}
              />
            </IconButton>
          </Box>
        </Box>
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

      {/* Modal dialog */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "10rem",
            width: "20rem",
          }}
        >
          <DialogTitle>{"Are you sure?"}</DialogTitle>
          <Divider sx={{ alignSelf: "center", width: "90%" }} />
          <DialogActions sx={{ p: "1rem" }}>
            <Button
              onClick={handleModalClose}
              variant="contained"
              color="secondary"
              sx={{ borderRadius: "100px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteClick}
              variant="contained"
              color="error"
              autoFocus
              sx={{ borderRadius: "100px" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default USerBookCard;
