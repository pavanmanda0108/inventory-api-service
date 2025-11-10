import type { Knex } from 'knex';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

// load project-root .env reliably even when CWD changes
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connection =
  process.env.DATABASE_URL ||
  {
    host: process.env.PGHOST || '127.0.0.1',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'inventory_db',
  };

const devConfig: Knex.Config = {
  client: 'pg',
  connection,
  pool: { min: 2, max: 10 },
  migrations: {
    directory: './data/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './data/seeds',
    extension: 'ts',
  },
};

// If using DATABASE_URL (e.g., Supabase), enable SSL for dev (safe for local dev)
if (process.env.DATABASE_URL) {
  // @ts-ignore
  devConfig.ssl = { rejectUnauthorized: false };
}

const config: { [key: string]: Knex.Config } = {
  development: devConfig,
  production: devConfig,
};

export default config;

// For CLI
module.exports = config;
