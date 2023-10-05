// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::req;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: req = serde_json::from_str(&json).unwrap();
// }

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Req {
    pub email: String,

    pub password: String,
}
