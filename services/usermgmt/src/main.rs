use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
// use reqwest;

use database::db::Database;

#[get("/")]
async fn hello() -> impl Responder {
//    let res=  reqwest::get("http://communicatemgmt-service:7070/communicatemgmt/").await.unwrap();
//     println!("Status: {}", res.status());
//     println!("Headers:\n{:#?}", res.headers());

//     let body = res.text().await.unwrap();
//     println!("Body:\n{}", body);
    Database::new();

    let s = String::from("Hello world!");

    HttpResponse::Ok().body(s)
}
#[get("/login")]
async fn login() -> impl Responder {
    HttpResponse::Ok().body("login")
}


#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Listening on http://localhost:9090/usermgmt/");
    HttpServer::new(|| {
        App::new().service(
            web::scope("/usermgmt")
                .service(hello)
                .service(echo),
        )
    })
    .bind(("0.0.0.0", 9090))?
    .run()
    .await
}

