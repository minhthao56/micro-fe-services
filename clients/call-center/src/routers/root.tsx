import { createBrowserRouter } from "react-router-dom";
import CustomerPage from "../pages/CustomerPage";
import DriverPage from "../pages/DriverPage";
import PhoneBooking from "../pages/PhoneBookingPage";
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
        element: <PhoneBooking />,
      },
      {
        path: "/customer",
        element: <CustomerPage />,
      },
      {
        path: "/driver",
        element: <DriverPage />,
      }
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
