import { Avatar, AvatarGroup, Card, CardHeader } from "@nextui-org/react";
import { getVIPCustomers } from "../services/booking/customer";
import { useQuery } from "@tanstack/react-query";

export function VIPCard() {
  const { data } = useQuery({
    queryKey: ["getVIPCustomers"],
    queryFn: getVIPCustomers,
  });

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
        {
          data?.customers?.map((_,index) => (
            <Avatar key={index}/>
          ))
        }
      </AvatarGroup>
    </Card>
  );
}
