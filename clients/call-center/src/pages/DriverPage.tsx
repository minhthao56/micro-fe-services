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
  Spinner,
  User,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { TopContent } from "../components/table/TopContent";
import { BottomContent } from "../components/table/BottomContent";
import moment from "moment";

const rowsPerPage = 10;

export default function DriversPage() {
  const [page, setPage] = useState(1);

  const { isPending, error, data, refetch, isFetching } = useQuery({
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

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-xl">Management Drivers</p>
        <Button onPress={onOpen} variant="flat" color="primary">
          Add
        </Button>
      </div>
      <Table
        aria-label="Example static collection table"
        bottomContent={
          <BottomContent page={page} pages={pages} setPage={setPage} />
        }
        classNames={{
          table: "min-h-[200px]",
        }}
        topContent={<TopContent total={data?.total || 0} />}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>VEHICLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.drivers || []}
          emptyContent={!isPending && "No rows to display."}
          loadingState={isFetching ? "loading" : "idle"}
          loadingContent={<Spinner />}
        >
          {(driver) => (
            <TableRow key={driver.driver_id}>
              <TableCell>
                <User
                  avatarProps={{ radius: "lg", src: "" }}
                  description={driver.email}
                  name={driver.last_name + " " + driver.first_name}
                />
              </TableCell>
              <TableCell>{driver.phone_number}</TableCell>
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
              <TableCell>{moment(driver.created_at).format("DD/MM/YYYY")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateDriver
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refetch={refetch}
      />
    </>
  );
}
