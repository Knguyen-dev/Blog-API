import { alpha } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
/**
 * So this color is called 'primary' and we provide various different shadows of the color.
 * So each object represents a color and its shades.
 *
 */
const PRIMARY = {
  lighter: "#C8FACD",
  light: "#5BE584",
  main: "#0162C4",
  dark: "#007B55",
  darker: "#005249",
};
const SECONDARY = {
  lighter: "#D6E4FF",
  light: "#84A9FF",
  main: "#3366FF",
  dark: "#1939B7",
  darker: "#091A7A",
};
const INFO = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#1890FF",
  dark: "#0C53B7",
  darker: "#04297A",
};
const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
};
const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFC107",
  dark: "#B78103",
  darker: "#7A4F01",
};
const ERROR = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#FF4842",
  dark: "#B72136",
  darker: "#7A0C2E",
};

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

/**
 * Combines our color definitions into an object.
 * We add properties like 'common' (black and white), and other things
 * such as 'actions' which has colors for hover, selected, and disabled states.
 *
 */
const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  info: { ...INFO, contrastText: "#fff" },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: "#fff" },
  grey: GREY,
  divider: GREY[500_24],

  neutral: {
    light: "#e0d4d4",
    dark: "#0C0B0B",
  },

  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

/**
 * Create the color palette object, which has light and dark properties for light and dark mode.
 * It has the common color object, but it also defines text and background colors.
 *
 * Then 'text' could be used in typography, buttons, input fields, etc.
 *
 * All you need to know:
 * The theme is the centrla place for global styling rules.
 *
 * The palette is in the themee and it defines your color schemas.
 * So this includes things suc has "primary", "secondary" which are kind of like
 * background colors or presets, but laso it defines text colors.
 *
 * Your components will look in your theme and use things such as
 * palette.light.primary main for maybe the background color and also get
 * the contrast color. And then for typogrpahy compoennts it
 * may be looking at a palette.light.text.primary, or the text.secondary or
 * the text.disabled.
 *
 */
const palette = {
  light: {
    ...COMMON,
    mode: "light" as PaletteMode,
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: {
      paper: "#f3e9e9",
      default: "#FAF9F6",
      neutral: "#e2e8f0",
    },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    mode: "dark" as PaletteMode,
    text: { primary: "#fff", secondary: GREY[500], disabled: GREY[600] },
    background: {
      default: "#121212",
      paper: "#1f1b24",
      neutral: "#0C0B0B",
    },
    action: { active: GREY[500], ...COMMON.action },
  },
};

export default palette;
