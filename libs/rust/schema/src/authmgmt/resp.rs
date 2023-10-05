// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::resp;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: resp = serde_json::from_str(&json).unwrap();
// }

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Resp {
    pub email: String,

    pub uid: String,
}
