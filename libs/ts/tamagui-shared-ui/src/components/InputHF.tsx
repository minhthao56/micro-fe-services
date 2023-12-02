import { Input, InputProps, Text, YStack } from "tamagui";
import {
  useController,
  UseControllerProps,
  FieldValues,
} from "react-hook-form";

export interface InputHFProps<T extends FieldValues>
  extends Omit<InputProps, "onChangeText" | "value"> {
  hookForm: UseControllerProps<T>;
}

export function InputHF<T extends FieldValues>({
  hookForm,
  ...props
}: InputHFProps<T>) {
  const { field, fieldState } = useController<T>(hookForm);
  return (
    <YStack pb="$1">
      <Input
        {...props}
        onChangeText={field.onChange}
        value={field.value}
      />
      <Text color="$red10" fontSize="$1" ml="$1">{fieldState.error?.message}</Text>
    </YStack>
  );
}
