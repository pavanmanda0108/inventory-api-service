// src/server.ts
import app from "./app";
import { env } from "./config";
import { logger } from "./utils/logger";
import knexFactory from "knex";
import knexConfig from "./db/knexfile";

type Product = {
  item_cd: string; item_name: string; mrp: number;
  barcode: string | null; qr_code: string | null; discount: number;
};

async function ensureSchema() {
  const knex = knexFactory(knexConfig);

  // 1) Try migrations
  try {
    await knex.migrate.latest();
  } catch (e) {
    logger.warn({ err: e }, "Knex migrate failed; falling back to manual ensure");
  }

  // 2) Fallback: create table if missing
  const hasTable = await knex.schema.hasTable("products");
  if (!hasTable) {
    await knex.schema.createTable("products", (t) => {
      t.string("item_cd").primary();
      t.string("item_name").notNullable();
      t.decimal("mrp", 10, 2).notNullable();
      t.string("barcode").unique();
      t.string("qr_code").unique();
      t.decimal("discount", 5, 2).notNullable().defaultTo(0);
      t.timestamps(true, true);
    });
    await knex.schema.alterTable("products", (t) => {
      t.index(["barcode"], "idx_products_barcode");
      t.index(["qr_code"], "idx_products_qrcode");
    });
  }

  // 3) Seed if empty
  const row = await knex<Product>("products").first("item_cd");
  if (!row) {
    await knex("products").insert([
      { item_cd: "ITM001", item_name: "Blue Pen",    mrp: 10.0, barcode: "8901234567890", qr_code: "QR-ITM001", discount: 0 },
      { item_cd: "ITM002", item_name: "Notebook A5", mrp: 45.0, barcode: "8901234567891", qr_code: "QR-ITM002", discount: 5 },
      { item_cd: "ITM003", item_name: "Stapler Mini",mrp: 80.0, barcode: "8901234567892", qr_code: "QR-ITM003", discount: 10 }
    ]);
  }

  await knex.destroy();
}

async function start() {
  await ensureSchema();

  const server = app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port}`);
  });

  process.on("SIGINT", () => server.close(() => process.exit(0)));
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
}

start().catch((e) => {
  logger.error(e, "Failed to start server");
  process.exit(1);
});

