// src/db/index.ts
import knex, { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const connection =
  process.env.DATABASE_URL ||
  {
    host: process.env.PGHOST || '127.0.0.1',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'inventory_db',
  };

const config: Knex.Config = {
  client: 'pg',
  connection,
  pool: { min: 2, max: 10 },
};

// if using Supabase or any DATABASE_URL with TLS
if (process.env.DATABASE_URL) {
  // @ts-ignore
  config.ssl = { rejectUnauthorized: false };
}

const db = knex(config);

export default db;

