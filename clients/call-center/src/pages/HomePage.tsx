import { NumberCard } from "../components/NumberCard";
import { LatestBookingCard } from "../components/LatestBookingCard";
import { VIPCard } from "../components/VIPCard";
import { UserTable } from "../components/UserTable";
import { FaUser, FaTaxi, FaBookmark } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { Steam } from "../components/Steam";
import { Button, Card } from "@nextui-org/react";

export default function HomePage() {
  return (
    <>
      <div className="flex gap-4 mb-8">
        <div className="flex-auto">
          <div className="mb-6">
            <p className="text-2xl font-bold mb-3">General</p>
            <div className="flex justify-evenly items-center gap-3">
              <NumberCard
                title="Customers"
                number={100}
                new={4}
                total={97100}
                icon={FaUser}
                bg="green"
                path="/customer"
              />
              <NumberCard
                title="Drivers"
                number={100}
                new={4}
                total={97100}
                icon={FaTaxi}
                bg="blue"
                path="/driver"
              />
              <NumberCard
                title="Phones"
                number={100}
                new={4}
                total={97100}
                icon={FaPhoneVolume}
                bg="green"
                path="/phone-booking"
              />
              <NumberCard
                title="Booking"
                number={100}
                new={4}
                total={97100}
                icon={FaBookmark}
                bg="blue"
                path="/booking"
              />
            </div>
          </div>
          <p className="text-2xl font-bold mb-3">Statistics</p>
          <Card>
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
      <div className="mb-3 flex justify-between items-center">
        <p className="text-2xl font-bold">All Users</p>
        <Button variant="flat" color="primary">View All</Button>
      </div>
      <UserTable />
    </>
  );
}
