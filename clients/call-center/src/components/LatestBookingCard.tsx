import {
  Avatar,
  Card,
  CardHeader,
  Chip,
} from "@nextui-org/react";

export function LatestBookingCard() {
  return (
    <Card className="max-w-[300px] w-full p-3 gap-4">
        <CardHeader className="uppercase">
            Latest Booking
        </CardHeader>
      <div className="flex flex-row justify-evenly items-center">
        <Avatar
          isBordered
          color="primary"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <span className="flex-auto ml-3 text-small">Nguyen Thao Minh</span>
        <Chip size="sm" color="warning" className="mx-1">
          VIP
        </Chip>
        <span className="text-xs text-default-400">22/10/2021</span>
      </div>
      <div className="flex flex-row justify-evenly items-center">
        <Avatar
          isBordered
          color="primary"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <span className="flex-auto ml-3 text-small">Nguyen Thao</span>
        <Chip size="sm" color="warning" className="mx-1">
          VIP
        </Chip>
        <span className="text-xs text-default-400">22/10/2021</span>
      </div>
      <div className="flex flex-row justify-evenly items-center">
        <Avatar
          isBordered
          color="primary"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
        <span className="flex-auto ml-3 text-small">Nguyen Thao</span>
        <Chip size="sm"  className="mx-1">
          NON
        </Chip>
        <span className="text-xs text-default-400">22/10/2021</span>
      </div>
    </Card>
  );
}
