import { useQuery } from "@tanstack/react-query";
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
import { getPhoneBookingList } from "../services/communicate/phone-booking";
import TwilioAudio from "../components/TwilioAudio";

export default function PhoneBookingPage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["getPhoneBookingList"],
    queryFn: async () =>
      await getPhoneBookingList({ limit: 10, page: 0, search: "" }),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <p className="text-xl">Management Phone Booking</p>
        {/* <Button onPress={onOpen}>Add</Button> */}
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>START ADDRESS</TableColumn>
          <TableColumn>END ADDRESS</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTION</TableColumn>

        </TableHeader>
        <TableBody>
          {data.phone_booking ? (
            data.phone_booking.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.last_name + " " + item.first_name}</TableCell>
                <TableCell>{item.phone_number}</TableCell>
                <TableCell>
                  <TwilioAudio url={item.start_recording_url} />
                </TableCell>
                <TableCell>
                  <TwilioAudio url={item.end_recording_url} />
                </TableCell>
                <TableCell>
                  <Chip
                    color={
                      item.status === "PENDING"
                        ? "warning"
                        : item.status === "COMPLETED"
                        ? "success"
                        : "danger"
                    }
                  
                  >{item.status}</Chip>{" "}
                </TableCell>
                <TableCell>
                  <Button>Create Booking</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div>No data</div>
          )}
        </TableBody>
      </Table>
    </>
  );
}
