import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import BookDetails from "../../features/catalog/BookDetails";
import SignUp from "../../features/account/SignUp";
import SignIn from "../../features/account/SignIn";
import SignOut from "../../features/account/SignOut";
import NotFound from "../errors/NotFound";
import Unauthorized from "../errors/Unauthorized";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Page routes
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/catalog/:id", element: <BookDetails /> },

      // Account routes
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signout", element: <SignOut /> },

      // Error routes
      { path: "not-found", element: <NotFound /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
