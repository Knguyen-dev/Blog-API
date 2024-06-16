/*
+ Mui themes:
1. Customize mui breakpoints so that they align with tailwind css breakpoints.
2. Also use 'responsiveFontSizes' so that font sizes are responsive.
*/
import { createTheme, responsiveFontSizes } from "@mui/material";
import breakpoints from "./breakpoints";
import palette from "./palette";
import getComponentsTheme from "./components";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTheme = (preferences: any) => {
  const theme = createTheme({
    breakpoints: breakpoints,
    palette: preferences.darkMode ? palette.dark : palette.light,

    components: getComponentsTheme(preferences.animations),
  });
  return responsiveFontSizes(theme);
};
