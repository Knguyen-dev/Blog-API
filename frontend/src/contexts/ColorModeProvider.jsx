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

export default function ColorModeProvider({ children }) {
	/*
  - mode: Get the colorMode, from local storage. We ensure that the storedMode
    is either 'dark' or 'light' before returning it. If the stored mode isn't 'dark' and 'light'
    , then we default to 'dark'. Of course set the localStorage and then return the state value.
  */
	const [mode, setMode] = useState(() => {
		let storedMode = localStorage.getItem("colorMode");
		if (storedMode !== "dark" && storedMode !== "light") {
			storedMode = "dark";
		}
		localStorage.setItem("colorMode", storedMode);
		return storedMode;
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
	const colorMode = useMemo(
		() => ({
			toggleColorMode: () =>
				setMode((prev) => {
					const newMode = prev === "dark" ? "light" : "dark";
					localStorage.setItem("colorMode", newMode);
					return newMode;
				}),
		}),
		[]
	);

	const theme = useMemo(() => getTheme(mode), [mode]);

	return (
		// Spread the colorMode object, and pass back our mode also
		<ColorContext.Provider value={{ ...colorMode, mode }}>
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
