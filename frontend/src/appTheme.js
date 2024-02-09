/*
+ Mui themes:
1. Customize mui breakpoints so that they alig nwith tailwind css breakpoints.
2. Also use 'responsiveFontSizes' so that font sizes are responsive.
*/
import { createTheme, responsiveFontSizes } from "@mui/material";
const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			"2xl": 1536,
		},
	},
});
export const appTheme = responsiveFontSizes(theme);
