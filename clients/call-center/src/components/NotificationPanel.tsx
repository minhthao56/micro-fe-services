import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Divider,
} from "@nextui-org/react";
import { FaBell } from "react-icons/fa";
import { LuBellRing } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/communicate/notification";
import Loading from "./Loading";
import moment from "moment";

export function NotificationPanel() {
  const { error, data, isFetching } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: async () =>
      await getNotifications({
        limit: 100,
        offset: 0,
        status: "all",
      }),
  });
  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button isIconOnly>
          <FaBell />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-2 w-80">
          <div className="text-xl font-bold">Notifications</div>
          <Divider className="my-3" />
          {error && <div>{JSON.stringify(error)}</div>}
          {isFetching && <Loading />}
          {data?.notifications?.map((item, index) => (
            <div key={index} className="flex flex-row items-center mb-4">
              <LuBellRing />
              <div className="flex-1 ml-3 flex items-center">
                <div className="flex-1">
                  <div className="text-small font-bold mb-1">{item.title}</div>
                  <div className="text-xs flex-1">{item.body}</div>
                </div>
                <div className="text-xs text-default-300">
                  {moment(item.created_at).format("DD/MM/YYYY")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
