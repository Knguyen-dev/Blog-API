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

const getComponentsTheme = (useAnimations: boolean) => {
  const componentsTheme = useAnimations ? {} : disabledStyles;

  return componentsTheme;
};

export default getComponentsTheme;
