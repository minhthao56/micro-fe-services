import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCustomers } from "../services/booking/customer";
import CreateCustomer from "./CreateCustomer";
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
  Spinner,
  User,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { BottomContent } from "../components/table/BottomContent";
import { TopContent } from "../components/table/TopContent";
import moment from "moment";

const rowsPerPage = 10;

export default function CustomerPage() {
  const [page, setPage] = useState(1);

  const { isPending, error, data, refetch, isFetching } = useQuery({
    queryKey: ["getCustomers", page],
    queryFn: async () =>
      await getCustomers({
        limit: 10,
        offset: page * rowsPerPage - rowsPerPage,
        search: "",
      }),
    placeholderData: keepPreviousData,
  });

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total]);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-xl">Management Customers</p>
        <Button onPress={onOpen} variant="flat" color="primary">Add</Button>
      </div>
      <Table
        aria-label="Example static collection table"
        bottomContent={
          <BottomContent page={page} pages={pages} setPage={setPage} />
        }
        classNames={{
          table: "min-h-[200px]",
        }}
        topContent={<TopContent total={data?.total || 0} />}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>VIP</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>ADDRESS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={!isPending && "No rows to display."}
          loadingContent={<Spinner />}
          loadingState={isFetching ? "loading" : "idle"}
          items={data?.customers || []}
        >
          {(customer) => (
            <TableRow key={customer.customer_id}>
              <TableCell>
                <User
                  avatarProps={{ radius: "lg", src: "" }}
                  description={customer.email}
                  name={customer.last_name + " " + customer.first_name}
                />
              </TableCell>
              <TableCell>
                <Chip color={customer.is_vip ? "warning" : "default"}>
                  {customer.is_vip ? "VIP" : "Normal"}
                </Chip>
              </TableCell>
              <TableCell>{customer.phone_number}</TableCell>
              <TableCell>{customer.address?.formatted_address || "No Address"}</TableCell>
              <TableCell>{moment(customer.created_at).format("DD/MM/YYYY")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateCustomer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refetch={refetch}
      />
    </>
  );
}
