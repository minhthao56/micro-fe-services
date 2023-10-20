use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct WhoamiResp {
    pub email: String,

    pub uid: String,
}