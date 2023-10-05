mod controller;
use actix_web::{web, App, HttpServer, middleware::Logger};
use sqlx::{ Pool, Postgres};
use database::db::Database;
pub struct AppState {
    db: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = Database::new().await;
    println!("Listening on http://localhost:9090/usermgmt/");
    HttpServer::new(move|| {
        App::new()
        .app_data(web::Data::new(AppState { db: pool.clone() }))
        .service(
            web::scope("/usermgmt")
                .configure(controller::healthchecker::config)
                .configure(controller::user::config),
        ).wrap(Logger::default())
    })
    .bind(("0.0.0.0", 9090))?
    .run()
    .await
}

