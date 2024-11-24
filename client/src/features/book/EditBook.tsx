import {
  Box,
  Typography,
  Divider,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import DragAndDropFileUpload from "../../app/components/DragAndDropFileUpload";
import agent from "../../app/api/agent";
import { IBookAddPayload } from "../../app/types/type";
import { useNavigate, useParams } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IBookAddPayload>({
    title: "",
    description: "",
    author: "",
    year: "",
    genres: [],
    file: null,
  });
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    if (!id) {
      navigate("/not-found");
      return;
    }

    agent.Book.bookById(id)
      .then((response) => {
        setFormData((prev) => ({
          ...prev,
          ["title"]: response.title,
          ["description"]: response.description,
          ["author"]: response.author,
          ["year"]: response.year,
          ["genres"]: response.genres.map(
            (genre: { name: string }) => genre.name
          ),
        }));
      })
      .catch((error) => console.log(error));
  }, [id, navigate]);

  useEffect(() => {
    agent.Genre.list()
      .then((response) => {
        const genreNames = response.map(
          (genre: { name: string }) => genre.name
        );
        setGenres(genreNames);
      })
      .catch((error) => console.log(error));
  }, []);

  // handlers
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenresChange = (event: SelectChangeEvent<string[]>) => {
    setFormData((prev) => ({
      ...prev,
      genres: event.target.value as string[],
    }));
  };

  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      navigate("/not-found");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("author", formData.author);
    data.append("year", formData.year);
    formData.genres.forEach((genre) => data.append("genres", genre));
    if (formData.file) {
      data.append("file", formData.file);
    }

    agent.Book.edit(id, data)
      .then((response) => {
        console.log(response);
        navigate("/dashboard/books");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        <Typography variant="h4">Update book</Typography>
      </Box>
      <Divider sx={{ marginBottom: "1rem", width: "100%" }} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "100%",
          maxWidth: "600px",
          margin: "auto",
        }}
      >
        <FormControl fullWidth margin="normal">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={formData.genres}
            onChange={handleGenresChange}
            input={<OutlinedInput label="Genres" />}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                <Checkbox checked={formData.genres.includes(genre)} />
                <ListItemText primary={genre} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <DragAndDropFileUpload onFileUpload={handleFileUpload} />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ borderRadius: "100px", fontSize: "1rem" }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditBook;
