import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import BookDetails from "../../features/catalog/BookDetails";
import CreateBook from "../../features/book/CreateBook";
import EditBook from "../../features/book/EditBook";
import Dashboard from "../../features/dashboard/Dashboard";
import Profile from "../../features/dashboard/Profile";
import MyBooks from "../../features/dashboard/MyBooks";
import Settings from "../../features/dashboard/Settings";
import SignUp from "../../features/account/SignUp";
import SignIn from "../../features/account/SignIn";
import Logout from "../../features/account/Logout";
import BadRequest from "../errors/BadRequest";
import NotFound from "../errors/NotFound";
import Unauthorized from "../errors/Unauthorized";
import ServerError from "../errors/ServerError";
import TestPage from "../../features/testPage/TestPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Page routes
      { path: "/", element: <HomePage /> },
      { path: "/test", element: <TestPage /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/book/:id", element: <BookDetails /> },

      // Restricted routes
      {
        element: <RequireAuth />,
        children: [
          {
            path: "/dashboard/",
            element: <Dashboard />,
            children: [
              { path: "", element: <Profile /> },
              { path: "books", element: <MyBooks /> },
              { path: "settings", element: <Settings /> },
            ],
          },
          { path: "/book/create", element: <CreateBook /> },
          { path: "/book/edit/:id", element: <EditBook /> },
        ],
      },

      // Account routes
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/logout", element: <Logout /> },

      // Error routes
      { path: "/bad-request", element: <BadRequest /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      { path: "/server-error", element: <ServerError /> },
      { path: "/*", element: <NotFound /> },
    ],
  },
]);
