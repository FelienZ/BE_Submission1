import { configDotenv } from 'dotenv'
import pg, { Client,Connection } from 'pg' //ex. unused import w rule unused locals

configDotenv()
//pake pool/dbconn buat maxConn, waitConn
export const DBClient:pg.Connection = new Connection({
    host:process.env.APP_HOST||'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})
