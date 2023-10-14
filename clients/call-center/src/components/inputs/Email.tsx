import { Input, InputProps } from "@nextui-org/react";
import { MailIcon } from "../icons/MailIcon";



export default function Email(props: InputProps) {
  return (
    <Input
      type="email"
      label="Email"
      placeholder="you@example.com"
      labelPlacement="outside"
      name="email"
      endContent={
        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      }
      {...props}
    />
  );
}
