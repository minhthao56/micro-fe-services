import { useQuery } from "@tanstack/react-query";
import { NumberCard } from "../components/NumberCard";
import { LatestBookingCard } from "../components/LatestBookingCard";
import { VIPCard } from "../components/VIPCard";
import { FaUser, FaTaxi, FaBookmark } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { Steam } from "../components/Steam";
import { Card } from "@nextui-org/react";
import moment from "moment";

import { getGeneralNumber } from "../services/booking/dashboard";

export default function HomePage() {
  const { data, isPending } = useQuery({
    queryKey: ["getGeneralNumber"],
    queryFn: async () => await getGeneralNumber(),
  });
  return (
    <>
      <div className="flex gap-4 mb-8">
        <div className="flex-auto">
          <div className="mb-9">
            <p className="text-2xl font-bold mb-3">{`General ( ${moment().subtract(1, "month").startOf("month").format('MMMM')} )`}</p>
            <div className="flex justify-evenly items-center gap-3">
              <NumberCard
                title="Customers"
                number={data?.monthly_customer}
                new={data?.new_customer}
                total={data?.total_customer}
                icon={FaUser}
                bg="green"
                path="/customer"
                isLoading={isPending}
              />
              <NumberCard
                title="Drivers"
                number={data?.monthly_driver}
                new={data?.new_driver}
                total={data?.total_driver}
                icon={FaTaxi}
                bg="blue"
                path="/driver"
                isLoading={isPending}
              />
              <NumberCard
                title="Phones"
                number={data?.monthly_phone}
                new={data?.new_phone}
                total={data?.total_phone}
                icon={FaPhoneVolume}
                bg="green"
                path="/phone-booking"
                isLoading={isPending}
              />
              <NumberCard
                title="Booking"
                number={data?.monthly_booking}
                new={data?.new_booking}
                total={data?.total_booking}
                icon={FaBookmark}
                bg="blue"
                path="/booking"
                isLoading={isPending}
              />
            </div>
          </div>
          <p className="text-2xl font-bold mb-3">Statistic</p>
          <Card className="pt-3 pl-4 pb-2">
            <Steam />
          </Card>
        </div>
        <div className="flex-auto">
          <p className="text-2xl font-bold mb-3">Section</p>
          <VIPCard />
          <br />
          <LatestBookingCard />
        </div>
      </div>
    </>
  );
}
