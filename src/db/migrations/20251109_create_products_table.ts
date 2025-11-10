import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
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

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("products");
}
