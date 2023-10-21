use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct U {
    pub email: String,
    pub uid: String,
}