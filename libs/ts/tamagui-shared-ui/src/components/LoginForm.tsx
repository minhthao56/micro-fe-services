import { useEffect, useState } from "react";

import { Button, Form, H4, Spinner, Input } from "tamagui";
export function LoginForm() {
  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );
  useEffect(() => {
    if (status === "submitting") {
      const timer = setTimeout(() => setStatus("off"), 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);
  return (
    <Form
      alignItems="center"
      minWidth={350}
      gap="$2"
      onSubmit={() => setStatus("submitting")}
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
    >
      <H4>{status[0].toUpperCase() + status.slice(1)}</H4>
      <Input
        size="$4"
        borderWidth={2}
        keyboardType="email-address"
        width={300}
        placeholder="Email"
      />
      <Input
        size="$4"
        borderWidth={2}
        secureTextEntry
        width={300}
        placeholder="Password"
      />

      <Form.Trigger asChild disabled={status !== "off"}>
        <Button icon={status === "submitting" ? () => <Spinner /> : undefined}>
          Submit
        </Button>
      </Form.Trigger>
    </Form>
  );
}
