import { Pool, PoolClient } from 'pg'
require("dotenv").config();

export class Database {
    private static connection: Promise<PoolClient>;
    private constructor() { }
    private async connectPool (){
        const host = process.env.DB_URL;
        const user = process.env.POSTGRES_USER;
        const password = process.env.POSTGRES_PASSWORD;
        const database = process.env.DB_NAME;
        const pool = new Pool({
            host,
            user,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            password,
            database,
          })
          try {
           const conn =  await pool.connect()
            console.log('connected to database')
            if(conn){
                Database.connection = Promise.resolve(conn);
            }
            return conn;
          }catch(e){
            throw e;
          }
    }

    public static async getConnection(): Promise<PoolClient> {
        if (!Database.connection) {
            const db = new Database();
            await db.connectPool();
        }
        return Database.connection;
    }

}