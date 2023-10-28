import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../services/booking/customer";
import CreateCustomer from "./CreateCustomer";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function CustomerPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["getCustomers"],
    queryFn: async () =>
      await getCustomers({ limit: 10, offset: 0, search: "" }),
  });
  const { isOpen, onOpenChange, onOpen} = useDisclosure();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-xl">Management Customers</p>
        <Button onPress={onOpen}>Add</Button>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>EMAIL</TableColumn>
        </TableHeader>
        <TableBody>
          {data.customers ? (
            data.customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>
                  {customer.last_name + " " + customer.first_name}
                </TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.email}</TableCell>
              </TableRow>
            ))
          ) : (
            <div>No data</div>
          )}
        </TableBody>
      </Table>
      <CreateCustomer isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
