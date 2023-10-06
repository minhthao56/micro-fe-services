import type { LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import authProvider from "../auth";

export async function loginAction({ request }: LoaderFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

  
    if (!email) {
      return {
        error: "You must provide a email to log in",
      };
    }
  
    try {
      await authProvider.signIn(email.toString(), password.toString());
    } catch (error) {
      return {
        error: "Invalid login attempt",
      };
    }
  
    const redirectTo = formData.get("redirectTo") as string | null;
    return redirect(redirectTo || "/");
  }


  export async function logoutAction() {
    await authProvider.signOut();
    return redirect("/");
  }