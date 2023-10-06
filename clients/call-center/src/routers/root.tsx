import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import {loginLoader, protectedLoader} from "./loader";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import { loginAction, logoutAction } from "./action";

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
        action: logoutAction,
      },
    ],
  },
]);

export default router;
