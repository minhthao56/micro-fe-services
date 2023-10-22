import { Input, InputProps } from "tamagui";
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
  const { field } = useController<T>(hookForm);
  return <Input {...props} onChangeText={field.onChange} value={field.value} />;
}
