/*
- Here's how we can extend the TypeBackground property on the theme object so that 
TypeScript knows theme.palette.background.neutral is a property on it.
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Palette } from "@mui/material/styles/createPalette";
declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    neutral: string;
  }
}
