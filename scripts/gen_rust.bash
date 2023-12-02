#!/bin/bash
# Define the base directory where your JSON files are located
base_dir="json"
# Loop through subdirectories
for subdir in "$base_dir"/*; do
    if [ -d "$subdir" ]; then
        # Extract the subdirectory name
        subdir_name=$(basename "$subdir")
        if [ "$subdir_name" == "usermgmt" ]; then
            continue
        fi

         if [ "$subdir_name" == "booking" ]; then
            continue
        fi

        if [ ! -d "libs/rust/schema/${subdir_name}" ]; then
            mkdir "libs/rust/schema/${subdir_name}"
        fi

        # Loop through each JSON file in the subdirectory
        for json_file in "$subdir"/*.json; do
            # Extract the filename without extension
            file_name=$(basename -- "$json_file")
            file_name_no_extension="${file_name%.*}"
            echo "Generating Rust for $subdir_name/$file_name_no_extension"
            quicktype \
            --src-lang schema "$json_file" \
            --out "libs/rust/schema/${subdir_name}/${file_name_no_extension}.rs" \
            --visibility public \
            --derive-debug \
            --derive-clone \
            --derive-partial-eq
        done
    fi
done