use schemars::{schema_for, JsonSchema};
use std::fs;
use std::io::Write;

use schema::usermgmt::user::{
    CreateUserRequest,
    CreateUserResponse
};


// Procedural macro to generate JSON schema for a struct
fn generate_schema_for_struct<T: JsonSchema>() -> String {
    let schema = schema_for!(T);
    serde_json::to_string_pretty(&schema).unwrap()
}


fn to_schema_json() {
    let structs = vec![
        ("CreateUserRequest", generate_schema_for_struct::<CreateUserRequest>()),
        ("CreateUserResponse", generate_schema_for_struct::<CreateUserResponse>()),
        // Add more structs here as needed
    ];

    for (name, schema) in structs {
        let filename = format!("json/usermgmt/{}.json", name);
        let mut file = fs::File::create(filename).expect("Failed to create");
        file.write_all(schema.as_bytes()).expect("Failed to write");
    }
}

fn main (){
    to_schema_json();
}