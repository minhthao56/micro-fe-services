import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import {authWeb} from "utils/firebase/web";
import {setToken} from "../services/initClient"

export async function protectedLoader({ request }: LoaderFunctionArgs) {
  const isAuthenticated = await authWeb.getIsAuthenticated();
  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  const token = await authWeb.getUser()?.getIdToken();
  console.log({token});

  if (token) {
    setToken(token);
  }
  return { user: authWeb.getUser() };
}

export async function loginLoader() {
  const isAuthenticated = await authWeb.getIsAuthenticated();
  if (isAuthenticated) {
    return redirect("/");
  }
  return null;
}
