import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Skeleton,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export interface NumberCardProps {
  number?: number;
  total?: number;
  new?: number;
  title?: string;
  icon?: any;
  bg?: "green" | "blue";
  path?: string;
  isLoading?: boolean;
}

export function NumberCard({
  number,
  total,
  new: newNumber,
  title,
  icon: Icon,
  bg,
  path,
  isLoading,
}: NumberCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className={
        bg === "green"
          ? `max-w-[300px] w-ful border-2 border-green-500 flex-1`
          : `max-w-[300px] w-ful border-2 border-blue-500 flex-1`
      }
    >
      <CardHeader className="justify-between">
        <div className="flex gap-3 justify-center items-center">
          <div className="border-1 p-3 rounded-full">{Icon && <Icon />}</div>
          <h4 className="text-small text-default-600 capitalize mr-1">
            {title}
          </h4>
        </div>
        <Button
          color="primary"
          radius="full"
          size="sm"
          variant="flat"
          onPress={() => {
            navigate(path || "/");
          }}
        >
          {"More"}
        </Button>
      </CardHeader>
      {isLoading ? (
        <Skeleton className="rounded-lg w-12 ml-3">
          <div className="h-10 rounded-lg bg-default-300"></div>
        </Skeleton>
      ) : (
        <CardBody className="px-3 py-0  flex flex-row items-end">
          <span className="text-3xl ml-1">{number}</span>
          <span className="text-xs text-default-400 ml-1 mb-0.5">monthly</span>
        </CardBody>
      )}

      <CardFooter className="gap-3 flex justify-end">
        {isLoading ? (
          <Skeleton className="rounded-lg w-12">
            <div className="h-7 rounded-lg bg-default-300"></div>
          </Skeleton>
        ) : (
          <Chip className="flex gap-1" variant="flat" color="success" size="sm">
            {`${newNumber} New`}
          </Chip>
        )}

        {isLoading ? (
          <Skeleton className="rounded-lg w-12">
            <div className="h-7 rounded-lg bg-default-300"></div>
          </Skeleton>
        ) : (
          <span className="text-xs text-default-400">{total} Total</span>
        )}
      </CardFooter>
    </Card>
  );
}
