const disableAnimations = {
  transition: "none !important",
  animation: "none !important",
};

const disabledStyles = {
  MuiCssBaseline: {
    styleOverrides: {
      "*, *::before, *::after": disableAnimations,
    },
  },
  MuiButton: {
    styleOverrides: {
      root: disableAnimations,
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: disableAnimations,
    },
    // Specific styles for the switch thumb and track
    thumb: disableAnimations,
    track: disableAnimations,
  },
};

export default disabledStyles;
