import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureProps,
  Input
} from "@nextui-org/react";

export interface CreateCustomerProps extends UseDisclosureProps{
  onOpenChange: () => void;
}

export default function CreateCustomer({isOpen, onOpenChange}: CreateCustomerProps) {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Customer
              </ModalHeader>
              <ModalBody>
              <Input size="sm" type="text" label="First Name" />
              <Input size="sm" type="text" label="Last Name" />
              <Input size="sm" type="email" label="Email" />
              <Input size="sm" type="text" label="Phone Number" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
