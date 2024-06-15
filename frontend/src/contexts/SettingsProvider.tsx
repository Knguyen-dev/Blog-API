import { createContext, useMemo, ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../theme/appTheme";
import useLocalStorage from "../hooks/useLocalStorage";

interface IPreferences {
  darkMode: boolean;
  animations: boolean;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsContext = createContext<
  | {
      toggleColorMode: () => void;
      toggleAnimations: () => void;
      preferences: IPreferences;
    }
  | undefined
>(undefined);

// Default preferences that are applied to the app, if we don't find that the user has any saved preferences.
const DEFAULT_PREFERENCES = {
  darkMode: true, // whether or not app is using dark mode
  animations: false, // whether or not app has animations turned  on
};

/*
+ isValidPreferences: Checks if the preferences object from the local storage was valid
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidPreferences = (value: any): value is IPreferences => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.darkMode === "boolean" &&
    typeof value.animations === "boolean"
  );
};

/**
 * Context provider for providing the app's current settings/themes and also functions to modify
 * those. Currently it provides information on whether the app us using dark mode or not
 * and also information on whether animations are turned on for the app.
 *
 * + Credit: https://mui.com/material-ui/customization/dark-mode/#dark-mode-by-default
 */
export default function SettingsProvider({ children }: SettingsProviderProps) {
  // We'll try to get any saved settings from local storage, if none exist we fallback to default settings
  // As well as this we pass a function to validate whether or not the saved settings are valid, and if they're not, we use the default settings.
  const { value: preferences, setValue: setPreferences } =
    useLocalStorage<IPreferences>(
      "preferences",
      DEFAULT_PREFERENCES,
      isValidPreferences
    );

  const themeControl = useMemo(
    () => ({
      // For toggling the dark mode
      toggleColorMode: () =>
        setPreferences((prev: IPreferences) => {
          const newPreferences = {
            ...prev,
            darkMode: !prev.darkMode,
          };
          return newPreferences;
        }),

      // For toggling animations
      toggleAnimations: () =>
        setPreferences((prev: IPreferences) => {
          const newPreferences = {
            ...prev,
            animations: !prev.animations,
          };
          return newPreferences;
        }),
    }),
    [setPreferences]
  );

  const theme = useMemo(() => {
    return getTheme(preferences);
  }, [preferences]);

  return (
    <SettingsContext.Provider value={{ ...themeControl, preferences }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}
