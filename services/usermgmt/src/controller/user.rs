use actix_web::{get, HttpResponse, Responder, web, post};
use serde::Deserialize;
use crate::{
    AppState, model,
};
use serde_json::json;
use types::user::CreateUserRequest;


#[derive(Deserialize, Debug)]
struct  FilterOptions{}

#[get("/whoami")]
async fn whoami() -> impl Responder {
    let s = String::from("whoami");
    HttpResponse::Ok().body(s)
}

#[get("/users")]
async fn get_all_user( 
    _: web::Query<FilterOptions>,
    data: web::Data<AppState>,
) -> impl Responder {

    let query_result = sqlx::query_as!(
        model::user::User,
        "SELECT user_id, email FROM users",
    )
    .fetch_all(&data.db)
    .await;

    if query_result.is_err() {
        let message = "Something bad happened while fetching all note items";
        return HttpResponse::InternalServerError()
            .json(json!({"status": "error","message": message}));
    }

    let users = query_result.unwrap();
    let json_response = serde_json::json!({
        "status": "success",
        "results": users.len(),
        "users": users
    });
    HttpResponse::Ok().json(json_response)
}


#[post("/create")]
async fn create_user(
    body: web::Json<CreateUserRequest>,
    data: web::Data<AppState>,
) -> impl Responder {
    let req = body.into_inner();
    println!("req: {:?}", req);
    let user = CreateUserRequest {
        email: req.email,
        first_name: req.first_name,
        last_name: req.last_name,
        user_group: req.user_group,
        password: req.password,
    };

   let tx =  data.db.begin().await;
    if tx.is_err() {
         return HttpResponse::InternalServerError().json(tx.err().unwrap().to_string());
    }
    let query_result = sqlx::query!(
        "INSERT INTO users (email, first_name, last_name) VALUES ($1, $2, $3)",
        user.email,user.first_name,user.last_name
    )
    .execute(&data.db)
    .await;

    if query_result.is_err() {
        let e = query_result.err().unwrap();
        return HttpResponse::InternalServerError().json(e.to_string());
    }
    let r = query_result.unwrap();
    let row_effected = r.rows_affected();

    if row_effected != 1 {
        let e = "Failed to insert user";
        return HttpResponse::InternalServerError().json(e.to_string());
    }
    let commit = tx.unwrap().commit().await;

    if commit.is_err() {
        let e = commit.err().unwrap();
        return HttpResponse::InternalServerError().json(e.to_string());
    }
    HttpResponse::Ok().json("ok")
}

pub fn config(conf: &mut web::ServiceConfig) {
    conf.service(whoami)
        .service(get_all_user)
        .service(create_user);
}