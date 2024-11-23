import { createContext, useEffect, useState } from "react";
import { Theme, ThemeProvider, useMediaQuery } from "@mui/material";
import { IThemeContext, IThemeMode } from "../types/type";
import { AppDarkTheme, AppLightTheme } from "../themes/theme";

export const ThemeContext = createContext<IThemeContext | null>(null);

export const ThemeContextProvider: React.FunctionComponent<
  React.PropsWithChildren
> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<IThemeMode>(IThemeMode.SYSTEM);
  const [theme, setTheme] = useState<Theme>(AppLightTheme);

  const SYSTEM_THEME: Exclude<IThemeMode, IThemeMode.SYSTEM> = useMediaQuery(
    "(prefers-color-scheme: dark)"
  )
    ? IThemeMode.DARK
    : IThemeMode.LIGHT;

  useEffect(() => {
    switch (themeMode) {
      case IThemeMode.LIGHT:
        setTheme(AppLightTheme);
        break;
      case IThemeMode.DARK:
        setTheme(AppDarkTheme);
        break;
      case IThemeMode.SYSTEM:
        switch (SYSTEM_THEME) {
          case IThemeMode.LIGHT:
            setTheme(AppLightTheme);
            break;
          case IThemeMode.DARK:
            setTheme(AppDarkTheme);
            break;
        }
        break;
      default:
        setTheme(AppLightTheme);
        break;
    }
  }, [SYSTEM_THEME, themeMode]);

  const switchThemeMode = (mode: IThemeMode) => {
    setThemeMode(mode);
  };	

  return (
    <ThemeContext.Provider value={{ themeMode, switchThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
