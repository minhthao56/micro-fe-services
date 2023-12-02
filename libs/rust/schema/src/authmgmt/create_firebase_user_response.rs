// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::create_firebase_user_response;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: create_firebase_user_response = serde_json::from_str(&json).unwrap();
// }

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateFirebaseUserResponse {
    pub email: String,

    pub uid: String,
}
