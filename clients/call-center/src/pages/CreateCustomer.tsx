import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UseDisclosureProps,
  Input,
} from "@nextui-org/react";

import { useMutation } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { createUser } from "../services/usermgmt/user";
import { UserGroup } from "schema/constants/user-group";
import useToast from "../hooks/useToast";

interface FormValuesCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
export interface CreateCustomerProps extends UseDisclosureProps {
  onOpenChange: () => void;
  refetch: () => void;
}

export default function CreateCustomer({
  isOpen,
  onOpenChange,
  refetch,
}: CreateCustomerProps) {
  const { register, handleSubmit } = useForm<FormValuesCustomer>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const toast = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["createCustomer"],
    mutationFn: createUser,
  });

  const onSubmit = (data: FormValuesCustomer) => {
    console.log(data);
    mutate(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        password: "119955",
        user_group: UserGroup.CUSTOMER_GROUP,
        vehicle_type_id: 0,
      },
      {
        onSuccess: () => {
          console.log("Create customer successfully");
          toast("Create customer successfully", {
            type: "success",
          });
          onOpenChange();
          refetch();
        },
        onError: (error) => {
          toast(error.message, {
            type: "error",
          });
          console.log(error);
        },
      }
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Customer
              </ModalHeader>
              <ModalBody className="grid grid-cols-2 gap-2">
                <Input
                  size="sm"
                  type="text"
                  label="First Name"
                  {...register("firstName")}
                />
                <Input
                  size="sm"
                  type="text"
                  label="Last Name"
                  {...register("lastName")}
                />
                <Input
                  size="sm"
                  type="email"
                  label="Email"
                  {...register("email")}
                />
                <Input
                  size="sm"
                  type="text"
                  label="Phone Number"
                  {...register("phoneNumber")}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isPending}
                  isDisabled={isPending}
                >
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
