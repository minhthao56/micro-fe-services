import { useCallback } from "react";
import { createToast, Message, ToastOptions } from "vercel-toast";

export default function useToast() {
  const toast = useCallback((message: Message, options?: ToastOptions) => {
    return createToast(message, {
        type: "dark",
        timeout: 5000,
        ...options,
    });
  }, []);
  return toast
}
