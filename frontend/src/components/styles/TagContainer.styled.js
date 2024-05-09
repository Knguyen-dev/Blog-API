import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const TagContainer = styled(Button)(({ theme }) => ({
	border: "1px solid",
	padding: "0.4em 0.65em",
	boxShadow:
		theme.palette.mode === "light" ? "-4px 3px 0 0 #000" : "-4px 3px 0 0 #fff",
	color: theme.palette.mode === "light" ? "#000" : "#fff", // Text color
	borderColor: theme.palette.mode === "light" ? "#000" : "#fff", // Border color
	whiteSpace: "nowrap",
	textAlign: "center",
	textTransform: "uppercase",
	letterSpacing: "1px",
	width: "fit-content",
	"&:focus": {
		outline: "none",
		boxShadow: "0 0 0 2px #2684ff",
	},
}));

// Usage: Tpyically used when displaying the title of a tag or category
// <TagContainer onClick={handleClick} onKeyDown={handleKeyDown}>Tag Text</TagContainer>
