import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../services/booking/driver";
import CreateDriver from "./CreateDriver";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import Loading from "../components/Loading";

export default function DriversPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["getDrivers"],
    queryFn: async () => await getDrivers({ limit: 10, offset: 0, search: "" }),
  });

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  if (isPending) return <Loading/>

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-xl">Management Drivers</p>
        <Button onPress={onOpen}>Add</Button>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>VEHICLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {data.drivers ? (
            data.drivers.map((driver, index) => (
              <TableRow key={index}>
                <TableCell>
                  {driver.last_name + " " + driver.first_name}
                </TableCell>
                <TableCell>{driver.phone_number}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.vehicle_name}</TableCell>
                <TableCell>
                  <Chip color=  {driver.status === "ONLINE"? "success" :"danger"}> {driver.status}</Chip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div>No data</div>
          )}
        </TableBody>
      </Table>
      <CreateDriver isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
