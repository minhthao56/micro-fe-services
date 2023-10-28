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
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import SelectVehicle from "../components/inputs/SelectVehicle";
import { createUser } from "../services/usermgmt/user";
import { UserGroup } from "utils/constants/user-group";

export interface FormValuesDriver {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  vehicleTypeId: string;
}

export interface CreateDriverProps extends UseDisclosureProps {
  onOpenChange: () => void;
}

export default function CreateDriver({
  isOpen,
  onOpenChange,
}: CreateDriverProps) {
  const { register, handleSubmit } = useForm<FormValuesDriver>();
  const { mutate } = useMutation({
    mutationKey: ["createDriver"],
    mutationFn: createUser,
  });

  const onSubmit = (data: FormValuesDriver) => {
    mutate({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      vehicle_type_id: Number.parseInt(data.vehicleTypeId),
      password: "119955",
      user_group: UserGroup.DRIVER_GROUP,
    });
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Driver
              </ModalHeader>
              <ModalBody>
                <Input
                  size="sm"
                  type="text"
                  label="First Name"
                  {...register("firstName")}
                  placeholder="Enter your first name"
                />
                <Input
                  size="sm"
                  type="text"
                  label="Last Name"
                  {...register("lastName")}
                  placeholder="Enter your last name"
                />
                <Input
                  size="sm"
                  type="email"
                  label="Email"
                  {...register("email")}
                  placeholder="Enter your email"
                />
                <Input
                  size="sm"
                  type="text"
                  label="Phone Number"
                  {...register("phoneNumber")}
                  placeholder="Enter your phone number"
                />
                <SelectVehicle
                  {...register("vehicleTypeId")}
                  placeholder="Select a vehicle type"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleSubmit(onSubmit)}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
