import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { VerticalDotsIcon } from '../icons/VerticalDots'

export interface ActionsProps {
  onBooking?: () => void
  onCancel?: () => void
}
export function Actions({ onBooking, onCancel }: ActionsProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <VerticalDotsIcon className="text-default-300" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onPress={onBooking}>Booking</DropdownItem>
        <DropdownItem onPress={onCancel}>Cancel</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
