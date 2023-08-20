use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use reqwest;

#[get("/")]
async fn hello() -> impl Responder {
   let res=  reqwest::get("http://communicatemgmt-service:7070/communicatemgmt/").await.unwrap();
    println!("Status: {}", res.status());
    println!("Headers:\n{:#?}", res.headers());

    let body = res.text().await.unwrap();
    println!("Body:\n{}", body);

    let s = String::from("Hello world!");

    HttpResponse::Ok().body(s + &body)
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Listening on http://localhost:8080/authmgmt/");
    HttpServer::new(|| {
        App::new().service(
            web::scope("/authmgmt")
                .service(hello)
                .service(echo),
        )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

