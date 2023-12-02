use actix_web::{ HttpResponse, Responder, web::{self, ReqData}, post};
use schema::usermgmt::user::CreateUserRequest;
use crate::helpers::app::AppState;



#[post("/whoami")]
pub async fn pub_create_user(

    body: web::Json<CreateUserRequest>,
    data: web::Data<AppState>,

) -> impl Responder {

    let user_req = body.into_inner();

    println!("user_req: {:?}", user_req);

    // let firebase_user  = Req{
    //     email: user_req.email,
    //     password: user_req.password,
    // };

    HttpResponse::Ok().json(user_req)
}