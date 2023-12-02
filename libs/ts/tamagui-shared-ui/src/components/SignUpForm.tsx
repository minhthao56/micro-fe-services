import { Button, Form, Spinner, H4 } from "tamagui";
import { InputHF } from "./InputHF";
import { useForm } from "react-hook-form";

export type SignUpFormData = {
  email: string;
  password: string;
  phoneNumber: string;
  matchingPassword: string;
  firstName: string;
  lastName: string;
};
export type SignUpFormProps = {
  onSubmit: (data: SignUpFormData) => void;
  title?: string;
};

export function SignUpForm({ onSubmit, title }: SignUpFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<SignUpFormData>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      matchingPassword: "",
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

      <InputHF<SignUpFormData>
        size="$4"
        borderWidth={2}
        keyboardType="default"
        width={300}
        placeholder="First Name"
        hookForm={{
          name: "firstName",
          defaultValue: "",
          control,
          rules: {
            required: "First Name is required",
          },
        }}
      />
      <InputHF<SignUpFormData>
        size="$4"
        borderWidth={2}
        keyboardType="default"
        width={300}
        placeholder="Last Name"
        hookForm={{
          name: "lastName",
          defaultValue: "",
          control,
          rules: {
            required: "Last Name is required",
          },
        }}
      />
      <InputHF<SignUpFormData>
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
       <InputHF<SignUpFormData>
        size="$4"
        borderWidth={2}
        keyboardType="phone-pad"
        width={300}
        placeholder="Phone Number"
        hookForm={{
          name: "phoneNumber",
          defaultValue: "",
          control,
          rules: {
            required: "Phone Number is required"
          }
        }}
      />
      <InputHF<SignUpFormData>
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
      <InputHF<SignUpFormData>
        size="$4"
        borderWidth={2}
        secureTextEntry
        width={300}
        placeholder="Confirm Password"
        hookForm={{
          name: "matchingPassword",
          control,
          defaultValue: "",
          rules: {
            validate: (value) => {
                if (value === getValues().password) {
                    return true;
                }
                return "The passwords do not match";
            },
            required: "Confirm Password is required",
          },
        }}
      />

      <Form.Trigger asChild disabled={isSubmitting}>
        <Button
          icon={isSubmitting ? () => <Spinner /> : undefined}
          mt="$3"
          bg="$green8"
        >
          Sign Up
        </Button>
      </Form.Trigger>
    </Form>
  );
}
