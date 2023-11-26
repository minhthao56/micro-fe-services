import {Select, SelectItem, SelectProps} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "../../services/booking/vehicle-type";



export default function SelectVehicle(props: Omit<SelectProps, "children">) {
  const { data } = useQuery({
    queryKey: ["getVehicleTypes"],
    queryFn: async () =>
      await getVehicleTypes(),
  });
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Select 
            label="Select an animal" 
            size="sm"
            {...props}
          >
            {data?.vehicle_types ? data.vehicle_types.map((value) => (
              <SelectItem key={value.vehicle_type_id} value={value.vehicle_type_id}>
                {value.vehicle_name}
              </SelectItem>
            )) :<SelectItem key={""} isReadOnly>No Data</SelectItem>}
          </Select>
        </div>
      );
}
