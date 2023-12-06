import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "../icons/VerticalDots";

export interface ActionsProps {
  onBooking?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}
export function Actions({ onBooking, onCancel, disabled }: ActionsProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <VerticalDotsIcon className="text-default-300" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onPress={onBooking} isDisabled={disabled}>
          Booking
        </DropdownItem>
        <DropdownItem onPress={onCancel} isDisabled={disabled}>
          Cancel
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
