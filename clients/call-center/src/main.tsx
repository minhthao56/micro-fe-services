import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import router from "./routers/root";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <RouterProvider
          router={router}
          fallbackElement={<p>Initial Load...</p>}
        />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);
