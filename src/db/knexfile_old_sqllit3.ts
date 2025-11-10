// src/db/knexfile.ts
import { env } from "../config";
import type { Knex } from "knex";
import path from "path";
import fs from "fs";

const dbFile = path.isAbsolute(env.db.filename)
  ? env.db.filename
  : path.resolve(process.cwd(), env.db.filename);

// Ensure directory exists (SQLite won't create parent dirs)
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

// Helpful for debugging: show where we’re writing the DB
if (process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.log("[knex] Using SQLite file:", dbFile);
}

const config: Knex.Config = {
  client: env.db.client,
  connection: env.db.client === "sqlite3"
    ? { filename: dbFile }
    : (process.env.DATABASE_URL as any),
  useNullAsDefault: true,
  migrations: { directory: __dirname + "/migrations" },
  seeds: { directory: __dirname + "/seeds" },
  pool: { min: 1, max: 5 }
};

export default config;
// For CLI
module.exports = config;

