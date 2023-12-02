// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::custom_token_request;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: custom_token_request = serde_json::from_str(&json).unwrap();
// }

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CustomTokenRequest {
    #[serde(rename = "expo_push_token")]
    pub expo_push_token: Option<String>,

    pub firebase_token: String,

    pub user_group: String,
}
