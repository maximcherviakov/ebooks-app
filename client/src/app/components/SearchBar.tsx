import { IconButton, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { SyntheticEvent, useState } from "react";

interface Props {
  fontSize?: number;
  width?: string;
}

const Search = styled("form")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  height: "48px",
  position: "relative",
  borderRadius: "24px",
  backgroundColor: theme.palette.background.search,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  boxSizing: "border-box",
  border: "1px solid transparent",
  transition: "border .25s ease",
  "&:hover": {
    border: "1px solid #fff",
    borderColor: theme.palette.searchBorder,
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  zIndex: 1000,
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  margin: "4px 0",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function SearchBar({ fontSize, width }: Props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  function handleSubmit(text: string) {
    // navigate(`/search?q=${encodeURIComponent(text.trim())}`);
    // setSearchTerm("");
  }

  return (
    <Search
      onSubmit={(event: SyntheticEvent) => {
        event.preventDefault();
        handleSubmit(searchTerm);
      }}
      sx={{ width: width }}
    >
      <SearchIconWrapper>
        <IconButton type="submit" aria-label="search-button">
          <SearchIcon sx={{ fontSize: fontSize }} />
        </IconButton>
      </SearchIconWrapper>
      <StyledInputBase
        sx={{ fontSize: fontSize }}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={searchTerm}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(event.target.value)
        }
      />
    </Search>
  );
}
