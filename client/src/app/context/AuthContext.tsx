/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { getUser, removeUser, setUser } from "../utils/localStorageHelper";
import { IAuthContext, IUserPayload } from "../types/type";

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUserState] = useState<IUserPayload | null>(getUser());

  const login = (user: IUserPayload) => {
    setUserState(user);
    setUser(user);
  };

  const logout = () => {
    setUserState(null);
    removeUser();
  };

  const isAuthenticated = !!user?.token;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
