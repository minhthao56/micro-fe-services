use serde::{Deserialize, Serialize};
use sqlx::FromRow;

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