// src/server.ts
import 'dotenv/config';                // load env as early as possible
import app from './app';
import { env } from './config';
import { logger } from './utils/logger';
import db from './db';                 // shared Knex instance (configured for Postgres)

type Product = {
  item_cd: string;
  item_name: string;
  mrp: number;
  barcode: string | null;
  qr_code: string | null;
  discount: number;
};

async function ensureSchema() {
  // 1) Run migrations if knex migrate API is available and configured
  try {
    if (typeof (db as any).migrate === 'object' || typeof (db as any).migrate === 'function') {
      await (db as any).migrate.latest();
      logger.info('Migrations applied (if any).');
    }
  } catch (e) {
    logger.warn({ err: e }, 'Knex migrate failed; falling back to manual ensure');
  }

  // 2) Ensure table exists (idempotent)
  const hasTable = await db.schema.hasTable('products');
  if (!hasTable) {
    await db.schema.createTable('products', (t) => {
      t.string('item_cd').primary();
      t.string('item_name').notNullable();
      t.decimal('mrp', 10, 2).notNullable();
      t.string('barcode').unique();
      t.string('qr_code').unique();
      t.decimal('discount', 5, 2).notNullable().defaultTo(0);
      t.timestamps(true, true);
    });

    await db.schema.alterTable('products', (t) => {
      t.index(['barcode'], 'idx_products_barcode');
      t.index(['qr_code'], 'idx_products_qrcode');
    });

    logger.info('Created products table and indexes.');
  } else {
    logger.info('products table already exists.');
  }

  // 🔸 Remove seeding entirely — do NOT insert sample rows
  const count = await db<Product>('products').count<{ count: string }>('item_cd as count').first();
  logger.info(`Products table record count: ${count?.count}`);
}

async function start() {
  await ensureSchema();

  const server = app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port}`);
  });

  process.on('SIGINT', () => server.close(() => process.exit(0)));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}

start().catch((e) => {
  logger.error(e, 'Failed to start server');
  process.exit(1);
});

