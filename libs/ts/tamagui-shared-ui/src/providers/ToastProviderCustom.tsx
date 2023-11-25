import { PropsWithChildren } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { CheckCircle, AlertCircle } from "@tamagui/lucide-icons";
import { greenDark, redDark } from "@tamagui/colors";

export function ToastProviderCustom({
  children,
}: PropsWithChildren<{}>) {
  return (
    <ToastProvider
      placement="top"
      style={{ borderRadius: 50 }}
      successColor={greenDark.green9}
      dangerColor={redDark.red9}
      successIcon={<CheckCircle />}
      dangerIcon={<AlertCircle />}
    >
      {children}
    </ToastProvider>
  );
}
