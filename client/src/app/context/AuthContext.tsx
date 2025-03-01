/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken, setToken } from "../utils/localStorageHelper";
import { IAuthContext, IUserPayload } from "../types/type";
import agent from "../api/agent";

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [user, setUserState] = useState<IUserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(!!token);

  // Handlers to update state
  const setAuthToken = (token: string) => {
    setTokenState(token);
    setToken(token);
  };
  const setUser = (user: IUserPayload) => setUserState(user);

  const logout = () => {
    setTokenState(null);
    setUserState(null);
    removeToken();
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        setIsLoading(true);
        try {
          const response = await agent.User.current();
          const user = {
            username: response.username,
            email: response.email,
          };
          setUserState(user);
        } catch (error) {
          console.error("Failed to fetch user data: ", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setAuthToken,
        setUser,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
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
