use actix_web::{get, HttpResponse, Responder, web};
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    const MESSAGE: &str = "Build Simple CRUD API with Rust, SQLX, Postgres,and Actix Web";
    HttpResponse::Ok().json(json!({"status": "success","message": MESSAGE}))
}

pub fn config(conf: &mut web::ServiceConfig) {
    conf.service(health_checker_handler);
}