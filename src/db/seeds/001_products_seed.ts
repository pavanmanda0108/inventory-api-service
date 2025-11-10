import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("products").del();
  await knex("products").insert([
    { item_cd: "ITM001", item_name: "Camphour",    mrp: 10.0, barcode: "8901234567890", qr_code: "QR-ITM001", discount: 0 },
    { item_cd: "ITM002", item_name: "Kumkuma", mrp: 45.0, barcode: "8901234567891", qr_code: "QR-ITM002", discount: 5 },
    { item_cd: "ITM003", item_name: "Pasupu (Haldi)",mrp: 80.0, barcode: "8901234567892", qr_code: "QR-ITM003", discount: 10 }
  ]);
}
