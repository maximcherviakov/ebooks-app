import { IUserPayload } from "../types/type";

export const setUser = (user: IUserPayload): void => {
  const { username, email, token } = user;
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("token", token);
};

export const getUser = (): IUserPayload | null => {
  const username = localStorage.getItem("username") || "";
  const email = localStorage.getItem("email") || "";
  const token = localStorage.getItem("token") || "";
  return { username, email, token };
};

export const removeUser = (): void => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("token");
};
