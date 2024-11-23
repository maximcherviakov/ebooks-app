import { useContext } from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { IThemeContext, IThemeMode } from "../types/type";

const ThemeSwitcher: React.FunctionComponent = () => {
  const { themeMode, switchThemeMode } = useContext(
    ThemeContext
  ) as IThemeContext;

  const handleSwitchTheme = (mode: IThemeMode) => {
    switchThemeMode(mode);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
        Theme mode
      </Typography>
      <ButtonGroup
        variant="contained"
        aria-label="Theme mode picker"
        sx={{ borderRadius: "1000px", overflow: "hidden" }}
      >
        <Button
          onClick={() => handleSwitchTheme(IThemeMode.LIGHT)}
          color={themeMode === IThemeMode.LIGHT ? "primary" : "secondary"}
        >
          Light
        </Button>
        <Button
          onClick={() => handleSwitchTheme(IThemeMode.DARK)}
          color={themeMode === IThemeMode.DARK ? "primary" : "secondary"}
        >
          Dark
        </Button>
        <Button
          onClick={() => handleSwitchTheme(IThemeMode.SYSTEM)}
          color={themeMode === IThemeMode.SYSTEM ? "primary" : "secondary"}
        >
          System
        </Button>
      </ButtonGroup>
      {/* <Button
        variant="contained"
        onClick={handleOpen}
        startIcon={<PaletteIcon />}
        ref={buttonRef}
      >
        Switch Theme
      </Button>
      <Menu open={openMenu} anchorEl={buttonRef.current} onClose={handleClose}>
        <MenuItem
          onClick={() => handleSwitchTheme(IThemeMode.LIGHT)}
          selected={themeMode === IThemeMode.LIGHT}
        >
          Light
        </MenuItem>
        <MenuItem
          onClick={() => handleSwitchTheme(IThemeMode.DARK)}
          selected={themeMode === IThemeMode.DARK}
        >
          Dark
        </MenuItem>
        <MenuItem
          onClick={() => handleSwitchTheme(IThemeMode.SYSTEM)}
          selected={themeMode === IThemeMode.SYSTEM}
        >
          System
        </MenuItem>
      </Menu> */}
    </Box>
  );
};

export default ThemeSwitcher;
