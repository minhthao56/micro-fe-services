import { Avatar, Card, CardHeader, Chip } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getLastBookingInDay } from "../services/booking/booking";
import moment from "moment";

export function LatestBookingCard() {
  const { data } = useQuery({
    queryKey: ["getLastBookingInDay"],
    queryFn: getLastBookingInDay,
  });

  console.log({ data });

  return (
    <Card className="max-w-[300px] w-full p-3 gap-4">
      <CardHeader className="capitalize font-bold text-xl">
        Latest Booking
      </CardHeader>
      {data?.booking?.length === 0 ? "No booking" : ""}
      {data?.booking?.map((item, index) => {
        return (
          <div
            className="flex flex-row justify-evenly items-center"
            key={index}
          >
            <div className="flex flex-1">
              <Avatar isBordered color="primary" 
              size="sm"
              />
            </div>

            <span className="flex-auto ml-3 text-small">
              {item.customer?.first_name} {item.customer?.last_name}
            </span>
            <Chip size="sm" color="warning" className="mx-1">
              {
                item.customer?.is_vip?"VIP" : "Normal"
              }
            </Chip>
            <span className="text-xs text-default-400">{moment(item.created_at).format("hh:mm-DD/MM/YYYY")}</span>
          </div>
        );
      })}
    </Card>
  );
}
