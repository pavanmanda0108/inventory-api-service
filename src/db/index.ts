import knex, { Knex } from 'knex';
import dotenv from 'dotenv';
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

const db: Knex = knex({
  client: 'pg',
  connection,
  pool: { min: 2, max: 10 },
  // If you used sqlite migrations directory previously, keep it in knexfile for CLI
});

export default db;

