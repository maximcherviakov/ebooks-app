export enum IThemeMode {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export interface IThemeContext {
  themeMode: IThemeMode;
  switchThemeMode: (mode: IThemeMode) => void;
}

export interface IUserPayload {
  username: string;
  email: string;
}

export interface IAuthContext {
  token: string | null;
  user: IUserPayload | null;
  setAuthToken: (token: string) => void;
  setUser: (user: IUserPayload) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface IUserLoginPayload {
  email: string;
  password: string;
}

export interface IUserRegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface IBookAddPayload {
  title: string;
  description: string;
  author: string;
  year: string;
  genres: string[];
  file: File | null;
}
