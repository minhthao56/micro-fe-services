use entity::user::UserEntity;
use schemars::JsonSchema;
use serde::{Serialize, Deserialize};


#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct WhoamiResp {
    pub status: String,
    pub results: UserEntity,
}