import { X } from "@tamagui/lucide-icons";
import { PropsWithChildren } from "react";
import { Button, Dialog, Unspaced, DialogProps } from "tamagui";

export interface DialogInstanceProps extends DialogProps, PropsWithChildren {
    title?: string;
}

export function DialogInstance({title, children ,...props}: DialogInstanceProps) {
  return (
    <Dialog {...props}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title fontSize="$8">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
