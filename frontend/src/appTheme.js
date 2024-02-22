/*
+ Mui themes:
1. Customize mui breakpoints so that they align with tailwind css breakpoints.
2. Also use 'responsiveFontSizes' so that font sizes are responsive.
*/
import { createTheme, responsiveFontSizes } from "@mui/material";

// Define your custom colors
const colors = {
	lightMode: {
		headerBg: "#FFFFFF", // background color for header
		brandColor: "#121212", // Color for the app header's brand link.
		bodyBg: "#ddd", // Background color for the main content pages
		inputBg: "#F3F4F6", // background color for search bar
	},
	darkMode: {
		headerBg: "#121212",
		brandColor: "#FFFFFF",
		bodyBg: "#10172A",
		inputBg: "#374151",
	},
};

export const getTheme = (colorMode = "light") => {
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
				shortest: 150,
				shorter: 200,
				short: 250,
				standard: 300,
				complex: 375,
				enteringScreen: 250,
				leavingScreen: 250,
			},
		},
		palette: {
			mode: colorMode,

			/*
      - NOTE: Using spread operator so object is spread inside palette 
        object. So in the end we'd have palette: {mode: colorMode, headerBg: some_value, inputBg: some_value, etc.}
      */
			...(colorMode === "light" ? colors.lightMode : colors.darkMode),
		},
	});
	return responsiveFontSizes(theme);
};
