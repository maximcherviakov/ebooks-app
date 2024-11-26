import { useEffect, useState } from "react";
import { Book } from "../../app/models/book";
import agent from "../../app/api/agent";
import { useSearchParams } from "react-router-dom";
import { MetaData, PaginatedResponse } from "../../app/models/pagination";
import {
  Box,
  Button,
  FormControl,
  Grid2,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import BookCard from "../../app/components/BookCard";
import AppPagination from "../../app/components/AppPagination";
import { Genre } from "../../app/models/book";

interface IFilterFormData {
  sortBy: string;
  sortOrder: string;
  genre: string;
  author: string;
  year: number | undefined;
}

const sortByOptions = [
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
  { value: "author", label: "Author" },
  { value: "year", label: "Year" },
  { value: "createdAt", label: "Created At" },
  { value: "updatedAt", label: "Updated At" },
];

const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const initialFormData: IFilterFormData = {
  sortBy: "createdAt",
  sortOrder: "desc",
  genre: "",
  author: "",
  year: undefined,
};

const Catalog = () => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  const [formData, setFormData] = useState<IFilterFormData>(initialFormData);

  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    agent.Genre.list()
      .then((response) => {
        const genreNames = response.map((genre: Genre) => ({
          _id: genre._id,
          name: genre.name,
        }));
        setGenres(genreNames);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const params = new URLSearchParams();
    params.append("limit", "12");

    // pagination
    const page = queryParams.get("page");

    // search
    const search = queryParams.get("search");

    // sort
    const sortBy = queryParams.get("sortBy");
    const sortOrder = queryParams.get("sortOrder");

    // filter
    const genre = queryParams.get("genre");
    const author = queryParams.get("author");
    const year = queryParams.get("year");

    // append to request
    if (page !== null && !isNaN(parseInt(page, 10)))
      params.append("page", page);

    if (search !== null && search?.trim()?.length !== 0)
      params.append("search", search);

    if (
      sortBy !== null &&
      sortBy?.trim()?.length !== 0 &&
      sortByOptions.some((option) => option.value === sortBy)
    )
      params.append("sortBy", sortBy);
    else params.append("sortBy", "createdAt");

    if (
      sortOrder !== null &&
      sortOrder?.trim()?.length !== 0 &&
      sortOrderOptions.some((option) => option.value === sortOrder)
    )
      params.append("sortOrder", sortOrder);
    else params.append("sortOrder", "desc");

    if (genre !== null && genre?.trim()?.length !== 0)
      params.append("genre", genre);

    if (author !== null && author?.trim()?.length !== 0)
      params.append("author", author);

    if (year !== null && !isNaN(parseInt(year, 10)))
      params.append("year", year);

    agent.Book.list(params)
      .then((response) => {
        const paginatedResponse: PaginatedResponse = response;
        setBooks(paginatedResponse.books);
        setMetadata(paginatedResponse.metadata);
      })
      .catch((error) => console.log(error));
  }, [queryParams]);

  useEffect(() => {
    const year = queryParams.get("year");

    const updatedFormData: IFilterFormData = {
      sortBy: queryParams.get("sortBy") ?? initialFormData.sortBy,
      sortOrder: queryParams.get("sortOrder") ?? initialFormData.sortOrder,
      genre: queryParams.get("genre") ?? initialFormData.genre,
      author: queryParams.get("author") ?? initialFormData.author,
      year:
        year !== null && !isNaN(parseInt(year, 10))
          ? parseInt(year, 10)
          : initialFormData.year,
    };

    setFormData(updatedFormData);
  }, [queryParams]);

  const onPageChange = (page: number) => {
    setQueryParams((params) => {
      params.set("page", page.toString());
      return params;
    });
  };

  const handleFilterChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    const parsedValue = name === "year" ? Math.max(0, Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQueryParams((params) => {
      if (formData.sortBy) params.set("sortBy", formData.sortBy);
      else params.delete("sortBy");
      if (formData.sortOrder) params.set("sortOrder", formData.sortOrder);
      else params.delete("sortOrder");
      if (formData.genre) params.set("genre", formData.genre);
      else params.delete("genre");
      if (formData.author) params.set("author", formData.author);
      else params.delete("author");
      if (formData.year) params.set("year", formData.year.toString());
      else params.delete("year");
      return params;
    });
  };

  const handleClearFilters = () => {
    setQueryParams((params) => {
      params.delete("search");
      params.delete("sortBy");
      params.delete("sortOrder");
      params.delete("genre");
      params.delete("author");
      params.delete("year");
      return params;
    });
    setFormData(initialFormData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        gap: "1rem",
        alignItems: "start",
        mx: "2rem",
        marginTop: "1rem",
        marginBottom: "3rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1",
          width: "100%",
          minHeight: "inherit",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            width: "100%",
            minHeight: "inherit",
            p: "1rem",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "start",
              gap: "1rem",
              width: "100%",
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                name="sortBy"
                value={formData.sortBy}
                onChange={(event) =>
                  handleFilterChange(event as SelectChangeEvent<string>)
                }
                input={<OutlinedInput label="Sort by" />}
              >
                {sortByOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Sort order</InputLabel>
              <Select
                name="sortOrder"
                value={formData.sortOrder}
                onChange={(event) =>
                  handleFilterChange(event as SelectChangeEvent<string>)
                }
                input={<OutlinedInput label="Sort order" />}
              >
                {sortOrderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                name="genre"
                value={formData.genre}
                onChange={(event) =>
                  handleFilterChange(event as SelectChangeEvent<string>)
                }
                input={<OutlinedInput label="Genre" />}
              >
                <MenuItem value="">None</MenuItem>
                {genres.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    <ListItemText primary={option.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleFilterChange}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Year"
                name="year"
                type="number"
                value={
                  formData.year !== undefined &&
                  formData.year !== null &&
                  formData.year !== 0
                    ? formData.year
                    : ""
                }
                onChange={handleFilterChange}
              />
            </FormControl>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: "100px", fontSize: "1rem" }}
            >
              Apply
            </Button>
            {formData.sortBy !== initialFormData.sortBy ||
            formData.sortOrder !== initialFormData.sortOrder ||
            formData.genre !== initialFormData.genre ||
            formData.author !== initialFormData.author ||
            formData.year !== initialFormData.year ? (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClearFilters}
                sx={{ borderRadius: "100px", fontSize: "1rem" }}
              >
                Clear All
              </Button>
            ) : (
              <></>
            )}
          </Box>
        </Paper>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "6",
          width: "100%",
          minHeight: "inherit",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            minHeight: "inherit",
            p: "1rem",
          }}
        >
          {!books || books.length === 0 ? (
            <>
              <Typography
                variant="body1"
                color="secondary"
                fontSize="1.2rem"
                alignSelf="center"
                sx={{ my: "auto" }}
              >
                No books found
              </Typography>
            </>
          ) : (
            <>
              <Grid2 container spacing={2} width="100%">
                {books.map((book) => (
                  <Grid2 size={2} key={book._id}>
                    <BookCard book={book} />
                  </Grid2>
                ))}
              </Grid2>
              {metadata && (
                <AppPagination
                  metaData={metadata}
                  onPageChange={(page: number) => {
                    onPageChange(page);
                  }}
                />
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Catalog;
