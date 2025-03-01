import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { IUserRegisterPayload, IUserLoginPayload } from "../types/type";
import { getToken } from "../utils/localStorageHelper";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => response,
  (error: AxiosError) => {
    const { status } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        router.navigate("/bad-request");
        break;
      case 401:
        router.navigate("/unauthorized");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        router.navigate("/server-error");
        break;
    }

    return Promise.reject(error.response);
  }
);

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const User = {
  signUp: (user: IUserRegisterPayload) =>
    requests.post("/users/register", user),
  signIn: (user: IUserLoginPayload) => requests.post("/users/login", user),
  current: () => requests.get("/users/info"),
  resetPassword: (data: { currentPassword: string; newPassword: string }) =>
    requests.post("/users/reset-password", data),
};

const Book = {
  list: (params?: URLSearchParams) => requests.get("/books", params),
  myList: () => requests.get("/books/foruser"),
  bookById: (id: string) => requests.get(`/books/book/${id}`),
  create: (data: FormData) => requests.post(`/books`, data),
  edit: (id: string, data: FormData) => requests.put(`/books/${id}`, data),
  delete: (id: string) => requests.delete(`/books/${id}`),
};

const Genre = {
  list: () => requests.get("/books/genres"),
};

const agent = {
  User,
  Book,
  Genre,
};

export default agent;
