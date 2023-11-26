import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
  Pagination,
} from "@nextui-org/react";
import Loading from "../components/Loading";
import { useMemo, useState } from "react";

const rowsPerPage = 10;

export default function DriversPage() {
  const [page, setPage] = useState(1);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getDrivers", page],
    queryFn: async () =>
      await getDrivers({
        limit: 10,
        offset: page * rowsPerPage - rowsPerPage,
        search: "",
      }),
    placeholderData: keepPreviousData,
  });


  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total]);

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  if (isPending) return <Loading />;

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-xl">Management Drivers</p>
        <Button onPress={onOpen}>Add</Button>
      </div>
      <Table
        aria-label="Example static collection table"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>VEHICLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        {data.drivers ? (
          <TableBody>
            {data.drivers.map((driver, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {driver.last_name + " " + driver.first_name}
                </TableCell>
                <TableCell>{driver.phone_number}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.vehicle_name}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      driver.status === "ONLINE"
                        ? "success"
                        : driver.status === "BUSY"
                        ? "warning"
                        : "danger"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {driver.status}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        )}
      </Table>
      <CreateDriver
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refetch={refetch}
      />
    </>
  );
}
