/*
+ Mui themes:
1. Customize mui breakpoints so that they align with tailwind css breakpoints.
2. Also use 'responsiveFontSizes' so that font sizes are responsive.
*/
import { createTheme, responsiveFontSizes } from "@mui/material";

// Define your custom colors
const colors = {
	lightMode: {
		headerBg: "#f1f5f9", // background color for header
		footerBg: "#f1f5f9",
		brandColor: "#121212", // Color for the app header's brand link.

		/*
    - Background color for a featured or special secution. We'll use make certain sections or ui elements
    in the 'main' landmark stand out a little more

     */
		sectionBg: "#f1f5f9",

		// Background color for our cards
		cardBg: "#f9fafb",

		inputBg: "#F3F4F6", // background color for search bar
		accordionBg: "#f4f4f5",
	},
	darkMode: {
		headerBg: "#0f172a",
		footerBg: "#0f172a",
		brandColor: "#FFFFFF",

		sectionBg: "#1f1A24", // Background color

		cardBg: "#18181b",

		inputBg: "#374151",

		accordionBg: "#121212", // background color for the accordion header
	},
};

/*
- Our code to take away any type of transition, animation, or effect 
  when the user doesn't want them.

*/
const disableEffects = {
	// Disables button ripples
	MuiButtonBase: {
		defaultProps: {
			disableRipple: true,
		},
	},

	// Disable all transitions and animations
	MuiCssBaseline: {
		styleOverrides: {
			"*, *::before, *::after": {
				transition: "none !important",
				animation: "none !important",
			},

			// Disabling ripple removes the 'focus-visible' style for buttons, so we'd have to add in our own
			// style when that happens.
			".Mui-focusVisible": {
				outline: "2px solid #007bff" /* Adjust the color to your preference */,
				"outline-offset": "2px",
			},
		},
	},
};

// Transitions that we apply to components when animations are turned o
const appTransitions = {
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTheme = (preferences: any) => {
	const theme = createTheme({
		breakpoints: {
			values: {
				xs: 0,
				sm: 640,
				md: 768,
				lg: 1024,
				xl: 1280,
			},
		},

		components: {
			// Conditionally disable effects (transitions/animations) based on preference
			...(!preferences.animations ? disableEffects : {}),
		},

		transitions: {
			// However if transitions are allowed, insert in our custom transitions values.
			...(preferences.animations ? appTransitions : {}),
		},

		palette: {
			mode: preferences.darkMode ? "dark" : "light",

			/*
      - NOTE: Using spread operator so object is spread inside palette 
        object. So in the end we'd have palette: {mode: colorMode, headerBg: some_value, inputBg: some_value, etc.}
      */
			...(preferences.darkMode ? colors.darkMode : colors.lightMode),
		},
	});
	return responsiveFontSizes(theme);
};
