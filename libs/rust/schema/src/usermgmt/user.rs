use serde::{Deserialize, Serialize};
use schemars::JsonSchema;



#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct CreateUserRequest {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub user_group: String,
    pub password: String,
    pub phone_number: String,
}


#[derive(Debug, Serialize, Deserialize, JsonSchema)]

pub struct CreateUserResponse {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub user_group: String,
    pub user_id: i32,
    pub phone_number: String,
}


