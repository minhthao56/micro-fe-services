import { Avatar, AvatarGroup, Card, CardHeader } from "@nextui-org/react";

export function VIPCard() {
  return (
    <Card className="max-w-[300px] w-full p-3 gap-4 pb-8">
        <CardHeader className="flex justify-center items-center flex-row">
          <p className="text-2xl font-bold">
          {'⭐'} VIP
          </p>
        </CardHeader>
        <span className="text-center text-default-400 text-sm">
        All VIP customers in your business. Let them know you care about them.
        </span>
      <AvatarGroup isBordered>
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
      </AvatarGroup>
    </Card>
  );
}
