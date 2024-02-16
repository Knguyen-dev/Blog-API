/*
+ Mui themes:
1. Customize mui breakpoints so that they align with tailwind css breakpoints.
2. Also use 'responsiveFontSizes' so that font sizes are responsive.
*/
import { createTheme, responsiveFontSizes } from "@mui/material";

// Define your custom colors
const colors = {
	lightMode: {
		headerBg: "#ddd",
		bodyBg: "#ddd",
		inputBg: "#F3F4F6",
	},
	darkMode: {
		headerBg: "#1F2937",
		bodyBg: "#10172A",
		inputBg: "#374151",
	},
};

// getDesignToken?

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
	transitions: {
		easing: {
			easeIn: "cubic-bezier(0.4, 0, 1, 1)",
			easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
			easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
			sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
		},
		duration: {
			// Define transition durations
			shortest: 150, // ms
			shorter: 200, // ms
			short: 250, // ms
			standard: 300, // ms
			complex: 375, // ms
			enteringScreen: 250, // ms
			leavingScreen: 250, // ms
		},
	},

	/*
  
  - light mode bg color for header : 
  - Dark mode bg color for header: #1F2937
  - Dark mode bg color for main body: #10172A
  - Dark mode bg color for search bar: #374151
  
  - NOTE: Changing from dark to light mode, Mui helps out as it 
    applies some custom colors that it believes will look good 
    in dark mode.
  */
	palette: {
		mode: "dark", // Light mode by default

		light: {
			headerBg: colors.lightMode.headerBg,
			inputBg: colors.lightMode.inputBg,
			bodyBg: colors.lightMode.bodyBg,
		},
		dark: {
			headerBg: colors.darkMode.headerBg,
			inputBg: colors.darkMode.inputBg,
			bodyBg: colors.darkMode.bodyBg,
		},
	},
});
export const appTheme = responsiveFontSizes(theme);
