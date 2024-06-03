/*
+ SettingsProvider: Going to be our 'theme' provider for allowing us 
  to control when our application is using dark or light mode.
+ Credit: https://mui.com/material-ui/customization/dark-mode/#dark-mode-by-default
*/

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

const DEFAULT_PREFERENCES = {
  darkMode: true,
  animations: false,
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

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const { value: preferences, setValue: setPreferences } =
    useLocalStorage<IPreferences>(
      "preferences",
      DEFAULT_PREFERENCES,
      isValidPreferences
    );

  /*
  - toggleColorMode: Toggles the color mode. If 'prev' is 'dark' then we 
    go light mode. Else if prev is 'light' or any other value, we go dark mode.
  */
  const themeControl = useMemo(
    () => ({
      toggleColorMode: () =>
        setPreferences((prev: IPreferences) => {
          const newPreferences = {
            ...prev,
            darkMode: !prev.darkMode,
          };
          return newPreferences;
        }),

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
    console.log("Recomputing theme since things changed!");

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
