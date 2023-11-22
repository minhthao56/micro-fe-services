import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

import { getManyBooking } from "../services/booking/booking";
import Loading from "../components/Loading";
import moment from "moment";

export default function PhoneBookingPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["getManyBooking"],
    queryFn: async () =>
      await getManyBooking({ limit: 10, offset: 0, search: "" }),
  });

  if (isPending) return <Loading />;
  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <p className="text-xl">Management Booking</p>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME CUSTOMER</TableColumn>
          <TableColumn>PHONE NUMBER CUSTOMER</TableColumn>
          <TableColumn>NAME DRIVER</TableColumn>
          <TableColumn>PHONE NUMBER DRIVER</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
        </TableHeader>

        {data.booking ? (
          <TableBody>
            {data.booking.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item?.customer?.last_name + " " + item?.customer?.first_name}
                </TableCell>
                <TableCell>{item?.customer?.phone_number}</TableCell>
                <TableCell>
                  {item?.driver?.last_name + " " + item?.driver?.first_name}
                </TableCell>
                <TableCell>{item?.driver?.phone_number}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      item.status === "STARTING"
                        ? "warning"
                        : item.status === "COMPLETED"
                        ? "success"
                        : "default"
                    }
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
