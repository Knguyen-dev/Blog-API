import PropTypes from "prop-types";
import { InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

// Contains the input element and button
const Search = styled("div")(() => ({
	position: "relative", // For search icon positioning
	display: "flex",
	borderRadius: "2px",
	overflow: "hidden",
	columnGap: "4px",
}));

// Search icon
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		// Good for controlling vertical size of search bar
		padding: theme.spacing(1.5, 1, 1.5, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
	},

	backgroundColor: theme.palette.inputBg,

	// Ensures that input stretches out to fill 'search container.
	flex: "auto",
}));

/*
- NOTE: You don't need to do useTheme() and pass in the theme prop to your components for 
  your theme to work. As long as you passed in the theme prop to Mui's ThemeProvider, then 
  you should be all good.
*/

export default function SearchBar({
	onSubmit,
	placeholder = "Search",
	className,
	name = "search",
}) {
	return (
		<form onSubmit={onSubmit} className={className}>
			<Search>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					placeholder={placeholder}
					inputProps={{ "aria-label": "search" }}
					name={name}
				/>

				<Button variant="contained" sx={{ borderRadius: 0 }} type="submit">
					Search
				</Button>
			</Search>
		</form>
	);
}

SearchBar.propTypes = {
	onSubmit: PropTypes.func,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	name: PropTypes.string,
};
