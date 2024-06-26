import { InputBase, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { ChangeEvent } from "react";

// Wrapper that contains and positions the input element and button
const Search = styled("div")(() => ({
  position: "relative", // For search icon positioning
  display: "flex",
  borderRadius: "2px",
  overflow: "hidden",
  columnGap: "4px",
}));

// Search icon stylings
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  zIndex: 5,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Styling the actual input component
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    // Good for controlling vertical size of search bar
    padding: theme.spacing(1.5, 1, 1.5, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },

  backgroundColor: theme.palette.background.paper,

  // Ensures that input stretches out to fill 'search container.
  flex: "auto",
}));

interface SearchBarProps {
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  name?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Controlled component for showing a search bar.
 */
export default function SearchBar({
  onSubmit,
  placeholder = "Search",
  className,
  name = "search",
  value,
  onChange,
}: SearchBarProps) {
  return (
    <Box className={className}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={placeholder}
          inputProps={{ "aria-label": "search" }}
          name={name}
          value={value}
          onChange={onChange}
        />

        <Button variant="contained" sx={{ borderRadius: 0 }} onClick={onSubmit}>
          Search
        </Button>
      </Search>
    </Box>
  );
}
