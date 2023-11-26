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
  Pagination,
} from "@nextui-org/react";
import Loading from "../components/Loading";
import { useMemo, useState } from "react";

const rowsPerPage = 10;

export default function CustomerPage() {
  const [page, setPage] = useState(1);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getCustomers", page],
    queryFn: async () =>
      await getCustomers({
        limit: 10,
        offset: page * rowsPerPage - rowsPerPage,
        search: "",
      }),
      placeholderData: keepPreviousData
  });

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total]);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  if (isPending) return <Loading />;

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-xl">Management Customers</p>
        <Button onPress={onOpen}>Add</Button>
      </div>
      <Table
        aria-label="Example static collection table"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>VIP</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>Address</TableColumn>
        </TableHeader>
        {data.customers && data.customers.length > 0 ? (
          <TableBody>
            {data.customers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {customer.last_name + " " + customer.first_name}
                </TableCell>
                <TableCell>
                  <Chip color={customer.is_vip ? "warning" : "default"}>
                    {customer.is_vip ? "VIP" : "Normal"}
                  </Chip>
                </TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address?.formatted_address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        )}
      </Table>
      <CreateCustomer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refetch={refetch}
      />
    </>
  );
}
