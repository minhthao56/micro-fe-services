use serde::{Deserialize, Serialize};
use schemars::{schema_for, JsonSchema};

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct CreateUserRequest {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub user_group: String,
    pub password: String,
}


pub fn to_json() {
    let schema = schema_for!(CreateUserRequest);
    println!("{}", serde_json::to_string_pretty(&schema).unwrap());
}
