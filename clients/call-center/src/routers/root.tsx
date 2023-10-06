import { createBrowserRouter, redirect } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import {loginAction, loginLoader, protectedLoader} from "./loader";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import { fakeAuthProvider } from "../auth/auth";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <PrivateLayout />,
    loader: protectedLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    id: "public",
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        loader: loginLoader,
        action: loginAction,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/logout",
        async action() {
          // We signout in a "resource route" that we can hit from a fetcher.Form
          await fakeAuthProvider.signout();
          return redirect("/");
        },
      },
    ],
  },
]);

export default router;
