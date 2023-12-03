import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  User,
} from "@nextui-org/react";

import { getManyBooking } from "../services/booking/booking";
// import Loading from "../components/Loading";
import moment from "moment";
import { useMemo, useState } from "react";
import { TopContent } from "../components/table/TopContent";
import { BottomContent } from "../components/table/BottomContent";

const rowsPerPage = 10;

export default function PhoneBookingPage() {
  const [page, setPage] = useState(1);
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["getManyBooking", page],
    queryFn: async () =>
      await getManyBooking({
        limit: 10,
        offset: page * rowsPerPage - rowsPerPage,
        search: "",
      }),
    placeholderData: keepPreviousData,
  });

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total]);

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <p className="text-xl">Management Booking</p>
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
          <TableColumn key="nameCustomer">NAME CUSTOMER</TableColumn>
          <TableColumn key="phoneCustomer">PHONE CUSTOMER</TableColumn>
          <TableColumn key="nameDriver">NAME DRIVER</TableColumn>
          <TableColumn key="phoneDriver">PHONE DRIVER</TableColumn>
          <TableColumn key="addressStart">ADDRESS START</TableColumn>
          <TableColumn key="addressEnd">ADDRESS END</TableColumn>
          <TableColumn key="status">STATUS</TableColumn>
          <TableColumn key="createdAt">CREATED AT</TableColumn>
        </TableHeader>

        <TableBody
          items={data?.booking || []}
          emptyContent={!isPending && "No rows to display."}
          isLoading={isPending}
          loadingState={isFetching ? "loading" : "idle"}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.booking_id}>
              <TableCell>
              <User
                  avatarProps={{ radius: "lg", src: "" }}
                  description={item?.customer?.email}
                  name={item?.customer?.last_name + " " + item?.customer?.first_name}
                />
              </TableCell>
              <TableCell>{item?.customer?.phone_number}</TableCell>
              <TableCell>
                {item?.driver?.last_name + " " + item?.driver?.first_name}
              </TableCell>
              <TableCell>{item?.driver?.phone_number}</TableCell>
              <TableCell>{item?.start_address?.formatted_address}</TableCell>
              <TableCell>{item?.end_address?.formatted_address}</TableCell>
              <TableCell>
                <Chip
                  color={
                    item.status === "STARTING"
                      ? "warning"
                      : item.status === "COMPLETED"
                      ? "success"
                      : "default"
                  }
                  size="sm"
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                {moment(item?.created_at).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
