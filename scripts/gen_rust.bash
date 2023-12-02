#!/bin/bash
# Define the base directory where your JSON files are located
base_dir="json"


convert_to_snake_case() {
  input=$1
  # Convert CamelCase to snake_case using sed
  snake_case=$(echo "$input" | sed 's/\([a-z]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')
  echo "$snake_case"
}

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

        if [ ! -d "libs/rust/schema/src/${subdir_name}" ]; then
            mkdir "libs/rust/schema/src/${subdir_name}"
        fi

        # Loop through each JSON file in the subdirectory
        for json_file in "$subdir"/*.json; do
            # Extract the filename without extension
            file_name=$(basename -- "$json_file")
            file_name_no_extension="${file_name%.*}"
            snake_string_snake_case=$(convert_to_snake_case "$file_name_no_extension")
            echo "Generating Rust for $subdir_name/$snake_string_snake_case"
            quicktype \
            --src-lang schema "$json_file" \
            --out "libs/rust/schema/src/${subdir_name}/${snake_string_snake_case}.rs" \
            --visibility public \
            --derive-debug \
            --derive-clone
        done
    fi
done