use std;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};


pub struct Database {
}

impl Database {
    pub async fn new(){
        let password =  std::env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");
        let user =  std::env::var("POSTGRES_USER").expect("POSTGRES_USER must be set");
        let db_name =  std::env::var("DB_NAME").expect("DB_NAME must be set");
        let db_url =  std::env::var("DB_URL").expect("DB_URL must be set");
        println!("password: {}, user: {}, db_name: {}, db_url:{}", password, user, db_name, db_url);

        let pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect("postgres://postgres:password@localhost:5432/postgres")
        .await
    {
        Ok(pool) => {
            println!("✅Connection to the database is successful!");
            pool
        }
        Err(err) => {
            println!("🔥 Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };
        
        
    } 
}