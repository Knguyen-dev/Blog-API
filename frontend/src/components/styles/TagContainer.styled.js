/*
+ TagContainer: Styled container used for displaying the category or tags associated
  with a post.
*/

import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const TagContainer = styled(Typography)(({ theme }) => ({
	border: "1px solid",
	padding: "0.4em 0.65em",
	boxShadow:
		theme.palette.mode === "light" ? "-4px 3px 0 0 #000" : "-4px 3px 0 0 #fff",
	whiteSpace: "nowrap",
	textAlign: "center",
	textTransform: "uppercase",
	letterSpacing: "1px",
	width: "fit-content",
}));
