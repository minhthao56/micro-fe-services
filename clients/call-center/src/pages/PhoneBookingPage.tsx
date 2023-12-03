import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FaBook } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
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
  Tooltip,
  Spinner,
  User,
} from "@nextui-org/react";
import { PhoneBooking } from "schema/communicate/phone-booking";
import moment from "moment";

import {
  getPhoneBookingList,
  updatePhoneBookingStatus,
} from "../services/communicate/phone-booking";
import TwilioAudio from "../components/TwilioAudio";
import CreateBooking from "./CreateBooking";
import { YesNo } from "../components/modals/YesNo";
import { BottomContent } from "../components/table/BottomContent";
import { TopContent } from "../components/table/TopContent";

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
          table: "min-h-[400px]",
        }}
        topContent={<TopContent total={data?.total || 0} />}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>START ADDRESS</TableColumn>
          <TableColumn>END ADDRESS</TableColumn>
          <TableColumn>STATUS</TableColumn>
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
                    description={item.email}
                    name={item.last_name + " " + item.first_name}
                  />
                </TableCell>
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
                    size="sm"
                    variant="flat"
                  >
                    {item.status}
                  </Chip>{" "}
                </TableCell>
                <TableCell>
                  {moment(item.created_at).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <Tooltip content="Booking for customer">
                    <Button
                      onPress={() => {
                        onOpen();
                        const booking = data?.phone_booking.find((booking) => {
                          return booking.call_sid === item.call_sid;
                        });
                        setPhoneBooking(booking);
                      }}
                      isDisabled={item.status !== "PENDING"}
                      isIconOnly
                      color="primary"
                    >
                      <FaBook />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Cancel booking">
                    <Button
                      isDisabled={item.status !== "PENDING"}
                      isIconOnly
                      color="danger"
                      onClick={() => {
                        onOpenYesNo();
                        const booking = data?.phone_booking.find((booking) => {
                          return booking.call_sid === item.call_sid;
                        });
                        setPhoneBooking(booking);
                      }}
                    >
                      <ImCancelCircle />
                    </Button>
                  </Tooltip>
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
