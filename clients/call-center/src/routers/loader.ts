import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { authWeb } from "utils/firebase/web";
import { SocketEventBooking } from "schema/constants/event";
import type { NewPhoneBookingSocket } from "schema/socket/phone-booking";
import { createToast } from 'vercel-toast'



import { setToken } from "../services/initClient";
import { whoami } from "../services/usermgmt/user";
import { socket } from "../services/communicate/client";

export async function protectedLoader({ request }: LoaderFunctionArgs) {
  try {
    const isAuthenticated = await authWeb.getIsAuthenticated();
    if (!isAuthenticated) {
      const params = new URLSearchParams();
      params.set("from", new URL(request.url).pathname);
      return redirect("/login?" + params.toString());
    }
    const token = await authWeb.getUser()?.getIdToken();
    console.log( {token });
    if (token) {
      setToken(token);
      socket.connect();
      socket.on("connect", () => {
        console.log("socket connected");
      });
      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
      socket.on("connect_error", (err) => {
        console.log("socket connect_error", err);
      });

      socket.on(SocketEventBooking.PHONE_BOOKING_NEW, (data: NewPhoneBookingSocket) => {
        createToast(`You have new booking from ${data.caller}`, { type: "dark", action:{
          text: "View",
          callback: () => {
            redirect(`/`)
          }
        } });
      });
    }
    const user = await whoami();
    localStorage.setItem("whoami", JSON.stringify(user.results));

    return { user: authWeb.getUser() };

  } catch (error) {
    console.error("error protectedLoader", error);
    socket.disconnect();
    socket.removeAllListeners();
    await authWeb.signOut();
    throw error;
  }
}

export async function loginLoader() {
  const isAuthenticated = await authWeb.getIsAuthenticated();
  if (isAuthenticated) {
    return redirect("/");
  }
  return null;
}
