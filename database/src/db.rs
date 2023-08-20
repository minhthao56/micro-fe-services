use postgres::{Client, NoTls};
use std;


pub struct Database {
}

impl Database {
    pub fn new(){
        let password =  std::env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");
        let user =  std::env::var("POSTGRES_USER").expect("POSTGRES_USER must be set");
        let db_name =  std::env::var("DB_NAME").expect("DB_NAME must be set");
        let db_url =  std::env::var("DB_URL").expect("DB_URL must be set");
        println!("password: {}, user: {}, db_name: {}, db_url:{}", password, user, db_name, db_url);
        let mut client = Client::connect(&db_url, NoTls).expect("connection error");
        let rows = client.query("SELECT user_id FROM public.user", &[]).expect("error executing query");
        for row in rows {
            println!("user_id: {}", row.get::<_, i32>(0));
        }
    } 
}