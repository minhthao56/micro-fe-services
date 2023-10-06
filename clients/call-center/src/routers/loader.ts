import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import authProvider from "../auth";

export async function protectedLoader({ request }: LoaderFunctionArgs) {
  const isAuthenticated = await authProvider.getIsAuthenticated();
  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return { user: authProvider.getUser() };
}

export async function loginLoader() {
  const isAuthenticated = await authProvider.getIsAuthenticated();
  if (isAuthenticated) {
    return redirect("/");
  }
  return null;
}
