import {
    Input,
    InputProps
} from "@nextui-org/react";
import { Controller, UseFormReturn } from "react-hook-form";


export interface InputHFProps extends Pick<UseFormReturn, "control">, InputProps { }

export default function InputHF({ control, name, ...props }: InputHFProps) {
    return (
        <Controller
            name={name || ""}
            control={control}
            render={({ field }) => (
                <Input
                    {...props}
                    {...field}
                />
            )}
        />
    )
}
