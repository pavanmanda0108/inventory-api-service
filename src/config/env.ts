import dotenv from "dotenv";
dotenv.config();

function req(env: string, def?: string) {
  const v = process.env[env] ?? def;
  if (v === undefined) throw new Error(`Missing env ${env}`);
  return v;
}

export const env = {
  nodeEnv: req("NODE_ENV", "development"),
  port: Number(req("PORT", "3000")),
  db: {
    client: req("DB_CLIENT", "sqlite3"),
    filename: req("DB_FILENAME", "./products.db")
  },
  logLevel: req("LOG_LEVEL", "info"),
  rateLimit: {
    windowMs: Number(req("RATE_LIMIT_WINDOW_MS", "60000")),
    max: Number(req("RATE_LIMIT_MAX", "100"))
  }
};
