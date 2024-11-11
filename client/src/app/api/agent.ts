import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => response,
  (error: AxiosError) => {
    const { status } = error.response as AxiosResponse;

    switch (status) {
      case 401:
        router.navigate("/unauthorized");
        break;
      case 404:
        router.navigate("/not-found");
        break;
    }

    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const User = {
  signUp: (user: object) => requests.post("/users/signup", user),
  signIn: (user: object) => requests.post("/users/signin", user),
};

const Book = {
  list: () => requests.get("/books"),
  bookById: (id: string) => requests.get(`/books/${id}`),
};

const agent = {
  User,
  Book,
};

export default agent;
