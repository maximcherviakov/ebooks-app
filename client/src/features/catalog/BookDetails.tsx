import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Book } from "../../app/models/book";
import agent from "../../app/api/agent";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const pdfViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    agent.Book.bookById(id)
      .then((response) => {
        setBook(response);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleReadOnline = () => {
    setShowPdfViewer((prev) => !prev);

    if (!showPdfViewer) {
      setTimeout(() => {
        pdfViewerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        mx: "5rem",
        marginTop: "1rem",
        marginBottom: "3rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "1rem",
          p: "1.5rem",
        }}
      >
        <Box
          sx={{
            flex: "3",
          }}
        >
          {book?.thumbnailFileName ? (
            <Card>
              <CardMedia
                component="img"
                image={`/api/books/thumbnail/${book?.thumbnailFileName}`}
                alt={book?.title}
              />
            </Card>
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "10",
            gap: "0.5rem",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ marginBottom: "0.5rem" }}
          >
            {book?.title}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
            {book?.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "start",
              alignItems: "start",
            }}
          >
            <Box sx={{ flex: "1" }}>
              <Typography variant="body1">Author:</Typography>
            </Box>
            <Box sx={{ flex: "8" }}>
              <Typography variant="body1">{book?.author}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "start",
              alignItems: "start",
            }}
          >
            <Box sx={{ flex: "1" }}>
              <Typography variant="body1">Year:</Typography>
            </Box>
            <Box sx={{ flex: "8" }}>
              <Typography variant="body1">{book?.year}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "start",
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: "1" }}>
              <Typography variant="body1">Genres:</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "0.5rem",
                flex: "8",
              }}
            >
              {book?.genres.map((genre) => (
                <Chip key={genre._id} color="default" label={genre.name} />
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "start",
              alignItems: "center",
              gap: "1rem",
              my: "2rem",
            }}
          >
            <Button
              component={Link}
              href={`/api/books/file/${book?.bookFileName}`}
              download={`${book?.title}`}
              variant="contained"
              sx={{
                borderRadius: "1000px",
                fontSize: "1rem",
                fontWeight: 600,
                px: "2rem",
              }}
              startIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <Button
              onClick={handleReadOnline}
              variant="contained"
              sx={{
                borderRadius: "1000px",
                fontSize: "1rem",
                fontWeight: 600,
                px: "2rem",
              }}
              startIcon={<AutoStoriesIcon />}
            >
              {showPdfViewer ? "Close Reader" : "Read Online"}
            </Button>
          </Box>
        </Box>
      </Box>
      {showPdfViewer && (
        <>
          <Divider sx={{ width: "96%" }} />
          <Box
            ref={pdfViewerRef}
            sx={{
              width: "100%",
              height: "100vh",
              mt: 4,
              borderRadius: "4px",
              overflow: "hidden",
              px: "10rem",
            }}
          >
            <iframe
              src={`/api/books/file/${book?.bookFileName}`}
              width="100%"
              height="100%"
              title="PDF Viewer"
              style={{ border: "none" }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default BookDetails;
