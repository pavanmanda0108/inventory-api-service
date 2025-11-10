import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  const exists = await knex.schema.hasTable('products');
  if (!exists) {
    return knex.schema.createTable('products', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.decimal('price', 10, 2).notNullable().defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  } else {
    // table exists — nothing to do
    return Promise.resolve();
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('products');
}

