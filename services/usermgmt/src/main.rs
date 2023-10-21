mod controller;
mod helpers;
mod middlewares;

use actix_web::{web, App, HttpServer, middleware::Logger};
use database::db::Database;
use helpers::firebase::get_public_keys;

use crate::helpers::app::AppState;
use middlewares::validate_jwt::ValidateJWT;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = Database::new().await;
    let public_keys = match get_public_keys().await {
        Ok(keys) => keys,
        Err(e) => {
            println!("Error getting public keys: {:?}", e);
            panic!("Error getting public keys: {:?}", e);
        }
    };
    let app_state = AppState {
        db: pool.clone(),
    };

    println!("Listening on http://localhost:9090/usermgmt/");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .service(
                web::scope("/usermgmt")
                    .configure(controller::healthchecker::config)
                    .configure(controller::user::config)
            )
            .wrap(Logger::default())
            .wrap(ValidateJWT::add_public_key(public_keys.clone()))
    })
    .bind(("0.0.0.0", 9090))?
    .run()
    .await
}


