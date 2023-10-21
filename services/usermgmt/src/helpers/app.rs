use sqlx::{ Pool, Postgres};
// use super::firebase::JwkKeys;
// use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Postgres>,
    // pub public_keys: Arc<JwkKeys>, 
}