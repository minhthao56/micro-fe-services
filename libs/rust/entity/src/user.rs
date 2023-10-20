use serde::{Deserialize, Serialize};
use schemars::{schema_for, JsonSchema};
use sqlx::FromRow;
use std::{fs, io::Write};

#[derive(Debug, FromRow, Deserialize, Serialize)]
#[allow(non_snake_case)]
pub struct UserEntity {
    pub user_id: i32,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub user_group: String,
    pub firebase_uid: String,
}

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct CreateUserRequest {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub user_group: String,
    pub password: String,
}


#[derive(Debug, Serialize, Deserialize, JsonSchema)]

pub struct CreateUserResponse {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub user_group: String,
    pub user_id: i32,
}



pub fn to_schema_json() {
    let schema = schema_for!(CreateUserRequest);
    let sdata=  serde_json::to_string_pretty(&schema).unwrap();
    let mut f = fs::File::create("json/usermgmt/create_user_request.json").expect("Failed to create");
    f.write_all(sdata.as_bytes()).expect("Failed to write");
}
