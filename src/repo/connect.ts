import { configDotenv } from 'dotenv';
import pg, { Pool } from 'pg'; 

configDotenv();
//pake pool/dbconn buat maxConn, waitConn -> env pake PG biar auto readable oleh migration
export const DBClient:pg.Pool = new Pool({
  host:process.env.PGHOST||'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});