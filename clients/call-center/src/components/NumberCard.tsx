import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export interface NumberCardProps {
  number: number;
  total: number;
  new: number;
  title: string;
  icon: any;
  bg: "green" | "blue";
  path: string;
}

export function NumberCard({
  number,
  total,
  new: newNumber,
  title,
  icon: Icon,
  bg,
  path
}: NumberCardProps) {
  const navigate = useNavigate();
  return (
    <Card className={`max-w-[300px] w-ful border-2 border-${bg}-500 flex-1`}>
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
            navigate(path);
          }}
        >
          {"More"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-3xl">{number}</CardBody>
      <CardFooter className="gap-3 flex justify-end">
        <Chip className="flex gap-1" variant="flat" color="success" size="sm">
          {`${newNumber} New`}
        </Chip>
        <span className="text-xs text-default-400">{total} Total</span>
      </CardFooter>
    </Card>
  );
}
