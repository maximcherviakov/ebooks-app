import { createTheme, Theme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    searchBorder: string;
  }
  interface PaletteOptions {
    searchBorder?: string;
  }

  interface TypeBackground {
    search: string;
  }

  // Extend PaletteOptions to reflect this change
  interface PaletteOptions {
    search?: TypeBackground;
  }
}

export const AppLightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    secondary: {
      main: "#b5b5b5",
    },
    background: {
      default: "#f4f6f8",
      paper: "#fff",
      search: "#e8e8e8",
    },
    searchBorder: "#303030",
  },
  typography: {
    fontFamily: "poppins, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          "& .MuiButtonGroup-grouped": {
            border: "none", // Removes the border between buttons
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ".link-button": {
          transition: "all .25s ease",
          color: "#303030",
          "&:hover": {
            color: "#000",
            textShadow: "1px 1px 4px #00000070",
          },
        },
        ".card-shadow": {
          transition: "all .25s ease",
          "&:hover": {
            boxShadow: "0 0 10px 4px #00000030",
          },
        },
      },
    },
  },
});

export const AppDarkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2283DC",
    },
    secondary: {
      main: "#b5b5b5",
    },
    background: {
      default: "#1d1e1f",
      paper: "#252627",
      search: "#303030",
    },
    searchBorder: "#ffffff",
  },
  typography: {
    fontFamily: "poppins, sans-serif",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#252627",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          "& .MuiButtonGroup-grouped": {
            border: "none", // Removes the border between buttons
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ".link-button": {
          transition: "color .25s ease",
          color: "#aeaeae",
          "&:hover": {
            color: "#fff",
          },
        },
        ".card-shadow": {
          transition: "all .1s ease",
          "&:hover": {
            boxShadow: "0 0 10px 4px #00000030",
          },
        },
      },
    },
  },
});
