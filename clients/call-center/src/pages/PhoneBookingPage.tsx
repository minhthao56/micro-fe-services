import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Chip,
  Spinner,
  User,
} from "@nextui-org/react";
import { PhoneBooking } from "schema/communicate/phone-booking";

import {
  getPhoneBookingList,
  updatePhoneBookingStatus,
} from "../services/communicate/phone-booking";
import TwilioAudio from "../components/TwilioAudio";
import CreateBooking from "./CreateBooking";
import { YesNo } from "../components/modals/YesNo";
import { BottomContent } from "../components/table/BottomContent";
import { TopContent } from "../components/table/TopContent";
import { Actions } from "../components/table/Actions";
import moment from "moment";

const rowsPerPage = 10;

export default function PhoneBookingPage() {
  const [page, setPage] = useState(1);

  const { isPending, error, data, refetch, isFetching } = useQuery({
    queryKey: ["getPhoneBookingList", page],
    queryFn: async () =>
      await getPhoneBookingList({
        limit: 10,
        offset: page * rowsPerPage - rowsPerPage,
        search: "",
      }),
    placeholderData: keepPreviousData,
  });

  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const {
    isOpen: isOpenYesNo,
    onOpenChange: onOpenChangeYesNo,
    onOpen: onOpenYesNo,
  } = useDisclosure();

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total]);

  const [phoneBooking, setPhoneBooking] = useState<PhoneBooking>();

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-6">
        <p className="text-xl">Management Phone Booking</p>
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
          <TableColumn>STATUS</TableColumn>
          <TableColumn>START ADDRESS</TableColumn>
          <TableColumn>END ADDRESS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.phone_booking || []}
          loadingState={isFetching ? "loading" : "idle"}
          loadingContent={<Spinner />}
          emptyContent={!isPending && "No rows to display."}
        >
          {(item) => {
            return (
              <TableRow key={item.call_sid}>
                <TableCell>
                  <User
                    avatarProps={{ radius: "lg", src: "" }}
                    description={item.phone_number}
                    name={item.last_name + " " + item.first_name}
                  />
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
                    size="sm"
                    variant="flat"
                  >
                    {item.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <TwilioAudio url={item.start_recording_url} />
                </TableCell>
                <TableCell>
                  <TwilioAudio url={item.end_recording_url} />
                </TableCell>
               
                <TableCell>
                  {moment(item.created_at).format("hh:mm DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Actions
                    onBooking={() => {
                      onOpen();
                      const booking = data?.phone_booking.find((booking) => {
                        return booking.call_sid === item.call_sid;
                      });
                      setPhoneBooking(booking);
                    }}
                    disabled={item.status !== "PENDING"}
                    onCancel={() => {
                      onOpenYesNo();
                      const booking = data?.phone_booking.find((booking) => {
                        return booking.call_sid === item.call_sid;
                      });
                      setPhoneBooking(booking);
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
      {isOpen ? (
        <CreateBooking
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          phoneBooking={phoneBooking}
          refetch={refetch}
        />
      ) : null}
      <YesNo
        isOpen={isOpenYesNo}
        onOpenChange={onOpenChangeYesNo}
        onYes={async () => {
          await updatePhoneBookingStatus(
            phoneBooking?.call_sid || "",
            "CANCELED"
          );
          onOpenChangeYesNo();
          refetch?.();
        }}
      >
        Are you sure to cancel this booking?
      </YesNo>
    </>
  );
}
