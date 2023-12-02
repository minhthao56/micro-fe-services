use actix_web::{ HttpResponse, Responder, post, web};
use reqwest::Client;
use schema::usermgmt::user::{CreateUserRequest, CreateUserResponse};
use crate::helpers::app::AppState;
use schema::{
    authmgmt::{
    create_firebase_user_request::CreateFirebaseUserRequest,
    create_firebase_user_response::CreateFirebaseUserResponse,

},
common::status::CommonResponse,

};
use utils::{read_file::endpoint_create_firebase_user, constants::CUSTOMER_GROUP};


#[post("/sign-up-customer")]
pub async fn pub_create_user(
    body: web::Json<CreateUserRequest>,
    data: web::Data<AppState>,
) -> impl Responder {

    let user_req = body.into_inner();

    println!("user_req: {:?}", user_req);

    if user_req.user_group != CUSTOMER_GROUP {
        return HttpResponse::BadRequest().json(CommonResponse {
            status: "error".to_string(),
            message: "user_group must be customer".to_string(),
        });
    }

    let firebase_user  = CreateFirebaseUserRequest{
        email: user_req.email,
        password: user_req.password,
    };


    let endpoint = endpoint_create_firebase_user();

    // =========Start a transaction==========
    let tx =  data.db.begin().await;
    if tx.is_err() {
        return HttpResponse::InternalServerError().json(tx.err().unwrap().to_string());
   }
    let res = match Client::new()
    .post(&endpoint)
    .json(&firebase_user)
    .send()
    .await {
        Ok(res) => res,
        Err(e) => {
            eprintln!("Make http req have an error: {}", e);
            return HttpResponse::InternalServerError().json(e.to_string());
        }
    };
    let response_text: String = match res.text().await  {
            Ok(body) => body,
            Err(e) => {
                eprintln!("Error response_text: {}", e);
                return HttpResponse::InternalServerError().json(e.to_string());
            }
    };
    // Attempt to parse the trimmed response as JSON
    let body: CreateFirebaseUserResponse = match  serde_json::from_str(response_text.trim()) {
        Ok(body) => body,
        Err(e) => {
            eprintln!("Error reading body: {}", e);
            return HttpResponse::InternalServerError().json(e.to_string());
        }
    };
    
    println!("body.email: {:?}", body.email);
    println!("body.uid: {:?}", body.uid);

    // INSERT data into users table
    let query_result = sqlx::query!(
        "INSERT INTO users (last_name, first_name, email, user_group, firebase_uid, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id",
        user_req.first_name,user_req.last_name, body.email, user_req.user_group, body.uid, user_req.phone_number,
    )
    .fetch_one(&data.db)
    .await;

    if query_result.is_err() {
        let e = query_result.err().expect("Error INSERT data into users table");
        eprintln!("Error INSERT data into users table: {}", e);
        return HttpResponse::InternalServerError().json(e.to_string());
    }
    let result = query_result.expect("No error when get user_id");

    // Create CUSTOMER_GROUP
    if user_req.user_group == CUSTOMER_GROUP {
        let query_result = sqlx::query!(
            "INSERT INTO customers (user_id) VALUES ($1)",
            result.user_id,
        )
        .execute(&data.db)
        .await;
        if query_result.is_err() {
            let e = query_result.err().expect("No error INSERT data into customers table");
            eprintln!("Error INSERT data into customers table: {}", e);
            return HttpResponse::InternalServerError().json(e.to_string());
        }
    }

    let commit = tx.unwrap().commit().await;
    if commit.is_err() {
        let e = commit.err().expect("No error commit the transaction");
        eprintln!("Error commit the transaction: {}", e);
        return HttpResponse::InternalServerError().json(e.to_string());
    }

    let user_resp = CreateUserResponse {
        email: body.email,
        first_name: user_req.first_name,
        last_name: user_req.last_name,
        user_group: user_req.user_group,
        user_id: result.user_id,
        phone_number: user_req.phone_number,
    };
    println!("user_resp: {:?}", user_resp);
    HttpResponse::Ok().json(user_resp)
}

pub fn config(conf: &mut web::ServiceConfig) {
    conf.service(pub_create_user);
}