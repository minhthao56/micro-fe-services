import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
} from "@nextui-org/react";

import { getManyBooking } from "../services/booking/booking";
import Loading from "../components/Loading";
import moment from "moment";
import { useMemo, useState } from "react";

const rowsPerPage = 10;

export default function PhoneBookingPage() {
  const [page, setPage] = useState(1);
  const { isPending, error, data } = useQuery({
    queryKey: ["getManyBooking", page],
    queryFn: async () =>
      await getManyBooking({
        limit: 10,
        offset: page * rowsPerPage - rowsPerPage,
        search: "",
      }),
      placeholderData: keepPreviousData
  });

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total]);

  if (isPending) return <Loading />;
  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <p className="text-xl">Management Booking</p>
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
          <TableColumn>NAME CUSTOMER</TableColumn>
          <TableColumn>PHONE CUSTOMER</TableColumn>
          <TableColumn>NAME DRIVER</TableColumn>
          <TableColumn>PHONE DRIVER</TableColumn>
          <TableColumn>ADDRESS START</TableColumn>
          <TableColumn>ADDRESS END</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
        </TableHeader>

        {data.booking ? (
          <TableBody>
            {data.booking.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item?.customer?.last_name + " " + item?.customer?.first_name}
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
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        )}
      </Table>
    </>
  );
}
