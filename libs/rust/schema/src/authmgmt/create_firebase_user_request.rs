// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::create_firebase_user_request;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: create_firebase_user_request = serde_json::from_str(&json).unwrap();
// }

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateFirebaseUserRequest {
    pub email: String,

    pub password: String,
}
