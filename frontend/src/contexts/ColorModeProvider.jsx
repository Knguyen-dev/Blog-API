/*
+ ColorModeProvider: Going to be our 'theme' provider for allowing us 
  to control when our application is using dark or light mode.


+ Credit: https://mui.com/material-ui/customization/dark-mode/#dark-mode-by-default
*/

import { createContext, useMemo, useState } from "react";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../appTheme";

import PropTypes from "prop-types";

export const ColorContext = createContext();

const DEFAULT_PREFERENCES = {
	darkMode: true,
	animations: false,
};

// Map of all the possible values for the user's preferneces
const VALID_PREFERENCES = {
	darkMode: [true, false],
	animations: [true, false],
};

const validatePreferences = (preferences) => {
	// Loop through the preferences and make sure the keys and values are valid values
	// If one of them isn't then we'll throw an error, causing us to default to default settings
	for (const key in preferences) {
		if (!VALID_PREFERENCES[key].includes(preferences[key])) {
			throw new Error(
				`"${key}" is not a valid value for "${DEFAULT_PREFERENCES[key].default}"!`
			);
		}
	}
};

export default function ColorModeProvider({ children }) {
	const [preferences, setPreferences] = useState(() => {
		try {
			const storedPreferences = JSON.parse(localStorage.getItem("preferences"));

			// If storedPreferences exists, check if it's valid, if so return it as state
			if (storedPreferences) {
				validatePreferences(storedPreferences);
				localStorage.setItem("preferences", JSON.stringify(storedPreferences));
				return storedPreferences;
			}
		} catch (err) {
			console.error("Error loading user preferences: " + err.message);
		}

		// Here, stored preferences wasn't valid or didn't exist in local storage
		// so use our default preferences. Set in localStorage and return it as state.
		localStorage.setItem("preferences", JSON.stringify(DEFAULT_PREFERENCES));
		return DEFAULT_PREFERENCES;
	});

	/*
  - NOTE: Why memoization? Mui docs use memoization when calculating the theme, so it seems 
    like it could be potentially expensive if a new theme is created everytime ColorModeProvider
    is re-rendered. 

  - Review on rendering: Component re-renders whenever state or props change. Or when a parent component re-renders
    all child components will re-render regardless of whether state or props have changed for the children.
    Though since ColorModeProvider is above the App component, any props or state changes to the App component
    and below won't trigger a re-render for the provider. The only way there'd be a re-render for ColorModeProvider
    would be in the case where we'd use 'setMode' or toggleColorMode!

  - colorMode: An object containing our important color controlling functions. It was memoized in the docs, which
    I guess ensures that the function never changes.

  - toggleColorMode: Toggles the color mode. If 'prev' is 'dark' then we 
    go light mode. Else if prev is 'light' or any other value, we go dark mode.
    This does well to handle times when the user goes to localStorage and changes the 
    value to something invalid, so in those cases we default to dark mode, which matches
    how we default to 'dark' mode in our initial state.
  */
	const themeControl = useMemo(
		() => ({
			toggleColorMode: () =>
				setPreferences((prev) => {
					const newPreferences = {
						...prev,
						darkMode: !prev.darkMode,
					};
					localStorage.setItem("preferences", JSON.stringify(newPreferences));
					return newPreferences;
				}),
		}),
		[]
	);

	const theme = useMemo(() => getTheme(preferences), [preferences]);

	// Then you'd change the function name from colorMode to probably
	// 'themeModule' or something similar

	return (
		// Spread the colorMode object, and pass back our mode also
		<ColorContext.Provider value={{ ...themeControl, preferences }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ColorContext.Provider>
	);
}

ColorModeProvider.propTypes = {
	children: PropTypes.element,
};
