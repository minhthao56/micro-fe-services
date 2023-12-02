use actix_web::{get, HttpResponse, Responder, web::{self, ReqData}, post};
use reqwest::Client;
use serde::Deserialize;
use crate::{ AppState,helpers::firebase};
use serde_json::json;
use entity::user::UserEntity;
use schema::{authmgmt::{
    req::Req,
    resp::Resp,
}, usermgmt::whoami::WhoamiResp};
use schema::usermgmt::{
    user::CreateUserRequest,
    user::CreateUserResponse,
};
use utils::read_file::read_config;
use utils::constants::{
    ADMIN_GROUP,
    CUSTOMER_GROUP,
    DRIVER_GROUP,
};


#[derive(Deserialize, Debug)]
struct  FilterOptions{}

#[get("/whoami")]
async fn whoami(
    firebase_user: ReqData<firebase::FirebaseUser>,
    data: web::Data<AppState>,
) -> impl Responder {
    let user_id = firebase_user.user_id.clone();
    let user_group = firebase_user.user_group.clone();
    let db_user_id = firebase_user.db_user_id.parse::<i32>().unwrap();

    let query_result = sqlx::query_as!(
        UserEntity,
        "SELECT user_id, email, firebase_uid, first_name, last_name, user_group, phone_number FROM users WHERE firebase_uid = $1 AND user_group = $2 AND user_id = $3",
        user_id,
        user_group,
        db_user_id,
    )
    .fetch_one(&data.db)
    .await;

    if query_result.is_err() {
        let e = query_result.err().expect("Error get user");
        eprintln!("Error get user: {}", e);
        return HttpResponse::InternalServerError()
            .json(json!({"status": "error","message": e.to_string()}));
    }
    
    let user = query_result.unwrap();
    
    println!("user: {:?}", user);

    let json_response = serde_json::json!(WhoamiResp {
        status: String::from("success"),
        results: user,
    });
    HttpResponse::Ok().json(json_response)
}

#[post("/create")]
async fn create_user(
    body: web::Json<CreateUserRequest>,
    data: web::Data<AppState>,
    firebase_user: ReqData<firebase::FirebaseUser>,
) -> impl Responder {
    let user_group = firebase_user.user_group.clone();

    if user_group != ADMIN_GROUP {
        return HttpResponse::InternalServerError()
            .json(json!({"status": "error","message": "You are not allowed to create user"}));
    }
    let user_req = body.into_inner();

    println!("user_req: {:?}", user_req);

    if user_req.user_group != ADMIN_GROUP && user_req.user_group != CUSTOMER_GROUP && user_req.user_group != DRIVER_GROUP {
        return HttpResponse::InternalServerError()
            .json(json!({"status": "error","message": "Invalid user group"}));
    }

    if user_req.user_group == ADMIN_GROUP {
        return HttpResponse::InternalServerError()
            .json(json!({"status": "error","message": "Don't allowed to create admin user"}));
    }

    let firebase_user  = Req{
        email: user_req.email,
        password: user_req.password,
    };
    let path = String::from("/common-configmap/url_auth_service");
    let ip_service = match read_config(path) {
        Ok(url) => url,
        Err(e) => {
            eprintln!("Error reading file: {}", e);
            return HttpResponse::InternalServerError().json(e.to_string());
        }
    };
    let endpoint = format!("http://{}:8080/authmgmt/create-firebase-user", ip_service);

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
    let body: Resp = match  serde_json::from_str(response_text.trim()) {
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

    // Create DRIVER_GROUP
    if user_req.user_group == DRIVER_GROUP {
        let query_result = sqlx::query!(
            "INSERT INTO drivers (user_id, vehicle_type_id, status) VALUES ($1, $2, $3)",
            result.user_id,
            user_req.vehicle_type_id,
            "OFFLINE"
        )
        .execute(&data.db)
        .await;
        if query_result.is_err() {
            let e = query_result.err().expect("No error INSERT data into drivers table");
            eprintln!("Error INSERT data into drivers table: {}", e);
            return HttpResponse::InternalServerError().json(e.to_string());
        }
    }

    // commit the transaction
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
    conf.service(whoami)
        .service(create_user);
}