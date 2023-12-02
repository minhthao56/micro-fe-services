import { Button, Form, Spinner, H4, YStack } from "tamagui";
import { InputHF } from "./InputHF";
import { useForm } from "react-hook-form";

export type LoginFormData = {
  email: string;
  password: string;
};
export type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void;
  title?: string;
};

export function LoginForm({ onSubmit, title }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <Form
      alignItems="center"
      minWidth={350}
      gap="$2"
      onSubmit={handleSubmit(onSubmit)}
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
    >
      <H4 mb="$3">{title}</H4>
      <InputHF<LoginFormData>
        size="$4"
        borderWidth={2}
        keyboardType="email-address"
        width={300}
        placeholder="Email"
        hookForm={{
          name: "email",
          defaultValue: "",
          control,
          rules: {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          },
        }}
      />
      <InputHF<LoginFormData>
        size="$4"
        borderWidth={2}
        secureTextEntry
        width={300}
        placeholder="Password"
        hookForm={{
          name: "password",
          control,
          defaultValue: "",
          rules: {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must have at least 6 characters",
            },
          },
        }}
      />

      <Form.Trigger asChild disabled={isSubmitting}>
        <Button
          icon={isSubmitting ? () => <Spinner /> : undefined}
          mt="$3"
          bg="$green8"
        >
          Login
        </Button>
      </Form.Trigger>
    </Form>
  );
}
