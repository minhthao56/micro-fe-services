use serde::{Serialize, Deserialize};
use schemars::JsonSchema;


#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct CommonResponse {
    pub status: String,
    pub message: String,
}