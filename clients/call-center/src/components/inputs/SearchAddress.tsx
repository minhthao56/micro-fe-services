import { Autocomplete, AutocompleteItem, AutocompleteProps } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { searchAddress } from "../../services/googleapis/place";



export default function SearchAddress(props: Omit<AutocompleteProps, "items" | "children">) {
    const list = useAsyncList({
        async load({ filterText }) {
            if (!filterText) return { items: [] };
            const res = await searchAddress(filterText);
            return {
                items: res?.places || [],
            };
        },
    });
    return (
        <Autocomplete
            className="w-full"
            inputValue={list.filterText}
            isLoading={list.isLoading}
            items={list.items}
            onInputChange={list.setFilterText}
            size="sm"
            allowsCustomValue
            {...props}
        >
            {(item: any) => (
                <AutocompleteItem
                    key={`${item.location.latitude}-${item.location.longitude}`}
                    className="capitalize"
                    textValue={`${item.formattedAddress}-${item.location.latitude}-${item.location.longitude}`}

                >
                    <span>
                        {item.formattedAddress}
                    </span>
                    <br />
                    <span className="text-tiny text-default-400">
                        {item.displayName.text}
                    </span>
                </AutocompleteItem>
            )}
        </Autocomplete>
    );

}
